import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminRequest } from '@/lib/adminAuth'

const UNAUTHORIZED = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// List compatibility rows for one configuration: ?configuration_id=...
export async function GET(request) {
  const configurationId = request.nextUrl.searchParams.get('configuration_id')
  if (!configurationId) return NextResponse.json({ error: 'Missing configuration_id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('compatibility')
    .select('os_id, compatible')
    .eq('configuration_id', configurationId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ compatibility: data })
}

// Set (insert or update) one OS's compatibility for a configuration.
export async function POST(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.configuration_id || !body.os_id) {
    return NextResponse.json({ error: 'Missing configuration_id or os_id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('compatibility')
    .upsert(
      { configuration_id: body.configuration_id, os_id: body.os_id, compatible: body.compatible === 'true' || body.compatible === true },
      { onConflict: 'configuration_id,os_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// Remove an OS's compatibility row (back to "Unknown").
export async function DELETE(request) {
  if (!isAdminRequest(request)) return UNAUTHORIZED
  const body = await request.json()
  if (!body.configuration_id || !body.os_id) {
    return NextResponse.json({ error: 'Missing configuration_id or os_id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('compatibility')
    .delete()
    .eq('configuration_id', body.configuration_id)
    .eq('os_id', body.os_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
