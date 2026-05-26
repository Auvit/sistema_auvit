import type { SupabaseClient } from '@supabase/supabase-js'
import type { Client, ClientInput } from '@/types/client'

export async function listClients(
  supabase: SupabaseClient
): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) return []
  return data as Client[]
}

export async function getClient(
  supabase: SupabaseClient,
  id: string
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data as Client
}

export async function createClient(
  supabase: SupabaseClient,
  input: ClientInput
) {
  return supabase.from('clients').insert(input).select().single()
}

export async function updateClient(
  supabase: SupabaseClient,
  id: string,
  input: ClientInput
) {
  return supabase.from('clients').update(input).eq('id', id).select().single()
}

export async function deleteClient(supabase: SupabaseClient, id: string) {
  return supabase.from('clients').delete().eq('id', id)
}
