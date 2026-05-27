import type { SupabaseClient } from '@supabase/supabase-js'
import { isUserRole, type UserProfile, type UserRole } from '@/types/user'

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, phone, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data || !isUserRole(data.role)) {
    return null
  }

  return data as UserProfile
}

export async function listUsers(
  supabase: SupabaseClient
): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, phone, created_at')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.filter((row): row is UserProfile => isUserRole(row.role))
}

export async function getUserById(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, phone, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data || !isUserRole(data.role)) return null
  return data as UserProfile
}

export async function upsertUserProfileByEmail(
  supabase: SupabaseClient,
  input: CreateUserInput
) {
  return supabase.rpc('admin_upsert_user_profile', {
    target_email: input.email,
    target_name: input.name || null,
    target_role: input.role,
    target_phone: input.phone || null,
  })
}

export async function updateUserProfile(
  supabase: SupabaseClient,
  id: string,
  input: { name?: string; role?: UserRole; phone?: string }
) {
  return supabase.from('users').update(input).eq('id', id).select().single()
}

export async function deleteUserProfile(supabase: SupabaseClient, id: string) {
  return supabase.from('users').delete().eq('id', id)
}

export type CreateUserInput = {
  email: string
  name: string
  role: UserRole
  phone?: string
}
