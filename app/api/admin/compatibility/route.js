import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminRequest } from '@/lib/adminAuth'

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()

  const { data: laptop } = await supabaseAdmin
    .from('laptops')
    .select('id')
    .eq('slug', body.laptop_slug)
    .single()

  const { data: os } = await supabaseAdmin
    .from('operating_systems')
    .select('id')
    .eq('slug', body.os_slug)
    .single()

  if (!laptop || !os) {
    return NextResponse.json({ error: 'Laptop or OS not found' }, { status: 404 })
  }

  const { error } = await supabaseAdmin.from('compatibility').insert([{
    laptop_id: laptop.id,
    os_id: os.id,
    compatible: body.compatible === 'true'
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}