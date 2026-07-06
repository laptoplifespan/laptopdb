import { NextResponse } from 'next/server'
import { searchAll } from '@/lib/search'

// Lightweight typeahead search: returns the top few matching laptops and OSes.
// Reads only public data, so no auth is required.
export async function GET(request) {
  const raw = request.nextUrl.searchParams.get('q') ?? ''
  const { laptops, systems } = await searchAll(raw, 6)
  return NextResponse.json({ laptops, operating_systems: systems })
}
