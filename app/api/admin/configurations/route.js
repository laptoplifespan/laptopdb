import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminRequest } from '@/lib/adminAuth'

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Build the column object from the request body (shared by insert + update).
function configFields(body) {
  return {
    label: body.label || null,
    cpu: body.cpu || null,
    ram_gb: body.ram_gb ? parseInt(body.ram_gb) : null,
    soldered_ram: body.soldered_ram === 'true' ? true : body.soldered_ram === 'false' ? false : null,
    max_ram_gb: body.max_ram_gb ? parseInt(body.max_ram_gb) : null,
    tpm_2_0: body.tpm_2_0 === 'true' ? true : body.tpm_2_0 === 'false' ? false : null,
    storage: body.storage || null,
    gpu: body.gpu || null,
    sort_order: body.sort_order ? parseInt(body.sort_order) : 0,
  }
}

// List configurations for one laptop: /api/admin/configurations?laptop_id=...
export async function GET(request) {
  const laptopId = request.nextUrl.searchParams.get('laptop_id')
  if (!laptopId) return NextResponse.json({ error: 'Missing laptop_id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('configurations')
    .select('*')
    .eq('laptop_id', laptopId)
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ configurations: data })
}

export async function POST(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.laptop_id) return NextResponse.json({ error: 'Missing laptop_id' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('configurations')
    .insert([{ laptop_id: body.laptop_id, ...configFields(body) }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PUT(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('configurations')
    .update(configFields(body))
    .eq('id', body.id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Update changed 0 rows — no configuration found with that id.' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('configurations').delete().eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
