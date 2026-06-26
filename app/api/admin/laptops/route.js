import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminRequest } from '@/lib/adminAuth'

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Build the column object from the request body (shared by insert + update).
function laptopFields(body) {
  return {
    brand: body.brand,
    model: body.model,
    slug: body.slug,
    year: body.year ? parseInt(body.year) : null,
    cpu: body.cpu || null,
    ram_gb: body.ram_gb ? parseInt(body.ram_gb) : null,
    soldered_ram: body.soldered_ram === 'true' ? true : body.soldered_ram === 'false' ? false : null,
    max_ram_gb: body.max_ram_gb ? parseInt(body.max_ram_gb) : null,
    storage: body.storage || null,
    gpu: body.gpu || null,
    display_inches: body.display_inches ? parseFloat(body.display_inches) : null,
    display_resolution: body.display_resolution || null,
    weight_kg: body.weight_kg ? parseFloat(body.weight_kg) : null,
    description: body.description || null,
    upgrade_path: body.upgrade_path || null,
  }
}

// List all laptops (used by the admin panel to pick one to edit).
export async function GET() {
  const { data, error } = await supabase
    .from('laptops')
    .select('*')
    .order('brand', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ laptops: data })
}

export async function POST(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()

  const { error } = await supabaseAdmin.from('laptops').insert([laptopFields(body)])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PUT(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('laptops')
    .update(laptopFields(body))
    .eq('id', body.id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Update changed 0 rows — no laptop found with that id.' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Remove any compatibility rows pointing at this laptop first.
  await supabaseAdmin.from('compatibility').delete().eq('laptop_id', body.id)

  const { error } = await supabaseAdmin.from('laptops').delete().eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
