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

export type CreateUserInput = {
  email: string
  name: string
  role: UserRole
  phone?: string
}
