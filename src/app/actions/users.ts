'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { isAdminClientConfigured } from '@/lib/supabase/admin'
import { isUserRole } from '@/types/user'
import { createAuthUserWithProfile, deleteAuthUser } from '@/services/auth-admin'
import {
  deleteUserProfile,
  updateUserProfile,
  upsertUserProfileByEmail,
} from '@/services/users'

function parseCreateUserForm(formData: FormData) {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const name = ((formData.get('name') as string) || '').trim()
  const role = ((formData.get('role') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim()
  const password = (formData.get('password') as string) || ''

  if (!email) return { error: 'El email es obligatorio.' as const }
  if (!isUserRole(role)) return { error: 'Rol inválido.' as const }
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' as const }
  }

  return {
    data: {
      email,
      name,
      role,
      phone: phone || undefined,
      password,
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

/** Crea cuenta en Auth + perfil en public.users (requiere service_role). */
export async function createUserAction(formData: FormData) {
  await requireAdmin()

  if (!isAdminClientConfigured()) {
    throw new Error(
      'Configura SUPABASE_SERVICE_ROLE_KEY en .env.local para crear usuarios desde la app.'
    )
  }

  const parsed = parseCreateUserForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  await createAuthUserWithProfile(parsed.data)

  revalidatePath('/usuarios')
  redirect('/usuarios')
}

/** Solo perfil si el usuario ya existe en Authentication (respaldo). */
export async function createUserProfileAction(formData: FormData) {
  const { supabase } = await requireAdmin()
  const parsed = parseCreateUserForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { password: _, ...profile } = parsed.data
  const { error } = await upsertUserProfileByEmail(supabase, profile)
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

  if (isAdminClientConfigured()) {
    try {
      await deleteAuthUser(id)
    } catch {
      // Perfil eliminado; Auth puede limpiarse manualmente en Supabase
    }
  }

  revalidatePath('/usuarios')
  redirect('/usuarios')
}
