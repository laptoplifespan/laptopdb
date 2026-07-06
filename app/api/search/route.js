import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Lightweight typeahead search: returns the top few matching laptops and OSes.
// Reads only public data via the anon client, so no auth is required.
export async function GET(request) {
  const raw = (request.nextUrl.searchParams.get('q') ?? '').trim()
  const safe = raw.replace(/[,%()\\]/g, ' ').trim()

  if (!safe) return NextResponse.json({ laptops: [], operating_systems: [] })

  const like = `%${safe}%`
  const [{ data: laptops }, { data: operating_systems }] = await Promise.all([
    supabase
      .from('laptops')
      .select('id, brand, model, slug, year')
      .or(`brand.ilike.${like},model.ilike.${like}`)
      .order('brand', { ascending: true })
      .order('year', { ascending: false })
      .order('model', { ascending: true })
      .limit(6),
    supabase
      .from('operating_systems')
      .select('id, name, version, type, slug')
      .or(`name.ilike.${like},type.ilike.${like},version.ilike.${like}`)
      .order('name', { ascending: true })
      .limit(6),
  ])

  return NextResponse.json({
    laptops: laptops ?? [],
    operating_systems: operating_systems ?? [],
  })
}
