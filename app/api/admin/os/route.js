import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminRequest } from '@/lib/adminAuth'

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

function osFields(body) {
  return {
    name: body.name,
    version: body.version || null,
    slug: body.slug,
    type: body.type || null,
    description: body.description || null,
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('operating_systems')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ operating_systems: data })
}

export async function POST(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()

  const { error } = await supabaseAdmin.from('operating_systems').insert([osFields(body)])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PUT(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('operating_systems')
    .update(osFields(body))
    .eq('id', body.id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Update changed 0 rows — no OS found with that id.' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Remove any compatibility rows pointing at this OS first.
  await supabaseAdmin.from('compatibility').delete().eq('os_id', body.id)

  const { error } = await supabaseAdmin.from('operating_systems').delete().eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
