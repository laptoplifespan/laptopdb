import { supabase } from '@/lib/supabase'

// Split a raw query into lowercase tokens on whitespace.
function tokenize(raw) {
  return (raw ?? '')
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

// Search laptops and operating systems. Every token must appear somewhere in the
// record's searchable text (AND across tokens). For laptops that text spans the
// brand, model, year, AND the specs of every configuration (CPU, GPU, VRAM,
// storage, RAM), so queries like "dell rtx 3000" or "i7-1165g7" work.
//
// Matching is done in code over the full (curated, modestly-sized) catalog. If the
// database ever grows into the thousands, switch to Postgres full-text search / an
// RPC — the callers won't need to change.
export async function searchAll(rawQuery, limit) {
  const tokens = tokenize(rawQuery)
  if (tokens.length === 0) return { laptops: [], systems: [] }

  const [{ data: laptops }, { data: configs }, { data: systems }] = await Promise.all([
    supabase
      .from('laptops')
      .select('id, brand, model, slug, year')
      .order('brand', { ascending: true })
      .order('year', { ascending: false })
      .order('model', { ascending: true }),
    supabase.from('configurations').select('laptop_id, cpu, gpu, vram, storage, ram_type, ram_gb'),
    supabase
      .from('operating_systems')
      .select('id, name, version, type, slug')
      .order('name', { ascending: true }),
  ])

  // Collect each laptop's configuration specs into one lowercased text blob.
  const specText = new Map()
  for (const c of configs ?? []) {
    const parts = [c.cpu, c.gpu, c.vram, c.storage, c.ram_type, c.ram_gb != null ? `${c.ram_gb}gb` : '']
    const prev = specText.get(c.laptop_id) ?? ''
    specText.set(c.laptop_id, `${prev} ${parts.filter(Boolean).join(' ')}`.toLowerCase())
  }

  const matchedLaptops = (laptops ?? []).filter((l) => {
    const blob = `${l.brand ?? ''} ${l.model ?? ''} ${l.year ?? ''} ${specText.get(l.id) ?? ''}`.toLowerCase()
    return tokens.every((t) => blob.includes(t))
  })

  const matchedSystems = (systems ?? []).filter((o) => {
    const blob = `${o.name ?? ''} ${o.type ?? ''} ${o.version ?? ''}`.toLowerCase()
    return tokens.every((t) => blob.includes(t))
  })

  return {
    laptops: limit ? matchedLaptops.slice(0, limit) : matchedLaptops,
    systems: limit ? matchedSystems.slice(0, limit) : matchedSystems,
  }
}
