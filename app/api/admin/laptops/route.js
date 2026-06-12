import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  const body = await request.json()

  const { error } = await supabase.from('laptops').insert([{
    brand: body.brand,
    model: body.model,
    slug: body.slug,
    year: body.year ? parseInt(body.year) : null,
    cpu: body.cpu || null,
    ram_gb: body.ram_gb ? parseInt(body.ram_gb) : null,
    max_ram_gb: body.max_ram_gb ? parseInt(body.max_ram_gb) : null,
    storage: body.storage || null,
    gpu: body.gpu || null,
    display_inches: body.display_inches ? parseFloat(body.display_inches) : null,
    display_resolution: body.display_resolution || null,
    weight_kg: body.weight_kg ? parseFloat(body.weight_kg) : null,
    description: body.description || null,
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}