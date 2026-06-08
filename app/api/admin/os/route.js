import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  const body = await request.json()

  const { error } = await supabase.from('operating_systems').insert([{
    name: body.name,
    version: body.version || null,
    slug: body.slug,
    type: body.type || null,
  }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}