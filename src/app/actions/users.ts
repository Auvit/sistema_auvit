'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { isUserRole } from '@/types/user'
import {
  deleteUserProfile,
  updateUserProfile,
  upsertUserProfileByEmail,
} from '@/services/users'

function parseUserForm(formData: FormData) {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const name = ((formData.get('name') as string) || '').trim()
  const role = ((formData.get('role') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim()

  if (!email) return { error: 'El email es obligatorio.' as const }
  if (!isUserRole(role)) return { error: 'Rol inválido.' as const }

  return {
    data: {
      email,
      name,
      role,
      phone: phone || undefined,
    },
  }
}

function parseUpdateUserForm(formData: FormData) {
  const name = ((formData.get('name') as string) || '').trim()
  const role = ((formData.get('role') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim()

  if (!isUserRole(role)) return { error: 'Rol inválido.' as const }

  return {
    data: {
      name: name || undefined,
      role,
      phone: phone || undefined,
    },
  }
}

export async function createUserProfileAction(formData: FormData) {
  const { supabase } = await requireAdmin()
  const parsed = parseUserForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { error } = await upsertUserProfileByEmail(supabase, parsed.data)
  if (error) throw new Error(error.message)

  revalidatePath('/usuarios')
  redirect('/usuarios')
}

export async function updateUserProfileAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const parsed = parseUpdateUserForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { error } = await updateUserProfile(supabase, id, parsed.data)
  if (error) throw new Error(error.message)

  revalidatePath('/usuarios')
  revalidatePath(`/usuarios/${id}`)
  redirect('/usuarios')
}

export async function deleteUserProfileAction(id: string) {
  const { supabase, user } = await requireAdmin()
  if (user.id === id) throw new Error('No puedes eliminar tu propio perfil.')

  const { error } = await deleteUserProfile(supabase, id)
  if (error) throw new Error(error.message)

  revalidatePath('/usuarios')
  redirect('/usuarios')
}
