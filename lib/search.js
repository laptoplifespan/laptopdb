import { supabase } from '@/lib/supabase'

// Split a raw query into safe tokens: drop characters that would break the
// PostgREST or() filter, then split on whitespace.
function tokenize(raw) {
  return (raw ?? '')
    .replace(/[,%()\\]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

// Search laptops and operating systems. Every token must match (AND); within a
// token, any of the relevant columns may match (OR). Numeric tokens also match a
// laptop's year. Pass a limit for the typeahead; omit it for the full results page.
export async function searchAll(rawQuery, limit) {
  const tokens = tokenize(rawQuery)
  if (tokens.length === 0) return { laptops: [], systems: [] }

  let laptopQuery = supabase.from('laptops').select('id, brand, model, slug, year')
  for (const t of tokens) {
    const parts = [`brand.ilike.%${t}%`, `model.ilike.%${t}%`]
    if (/^\d+$/.test(t)) parts.push(`year.eq.${t}`)
    laptopQuery = laptopQuery.or(parts.join(','))
  }
  laptopQuery = laptopQuery
    .order('brand', { ascending: true })
    .order('year', { ascending: false })
    .order('model', { ascending: true })
  if (limit) laptopQuery = laptopQuery.limit(limit)

  let osQuery = supabase.from('operating_systems').select('id, name, version, type, slug')
  for (const t of tokens) {
    osQuery = osQuery.or(`name.ilike.%${t}%,type.ilike.%${t}%,version.ilike.%${t}%`)
  }
  osQuery = osQuery.order('name', { ascending: true })
  if (limit) osQuery = osQuery.limit(limit)

  const [{ data: laptops }, { data: systems }] = await Promise.all([laptopQuery, osQuery])
  return { laptops: laptops ?? [], systems: systems ?? [] }
}
