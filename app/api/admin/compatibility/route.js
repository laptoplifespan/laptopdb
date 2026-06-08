import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  const body = await request.json()

  const { data: laptop } = await supabase
    .from('laptops')
    .select('id')
    .eq('slug', body.laptop_slug)
    .single()

  const { data: os } = await supabase
    .from('operating_systems')
    .select('id')
    .eq('slug', body.os_slug)
    .single()

  if (!laptop || !os) {
    return NextResponse.json({ error: 'Laptop or OS not found' }, { status: 404 })
  }

  const { error } = await supabase.from('compatibility').insert([{
    laptop_id: laptop.id,
    os_id: os.id,
    compatible: body.compatible === 'true'
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}