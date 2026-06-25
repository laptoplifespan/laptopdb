import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client using the secret service-role key.
// This key bypasses Row Level Security, so it must NEVER be imported
// into client components — only into server-side API routes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set — admin writes will fail')
}

export const supabaseAdmin = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  serviceRoleKey ?? 'placeholder',
  { auth: { persistSession: false } }
)
