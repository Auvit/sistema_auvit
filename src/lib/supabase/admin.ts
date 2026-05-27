import { createClient } from '@supabase/supabase-js'

/**
 * Cliente con service_role — SOLO en servidor (Server Actions / Route Handlers).
 * Nunca importar en componentes cliente.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY en .env.local. Agrégala desde Supabase → Settings → API.'
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function isAdminClientConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
