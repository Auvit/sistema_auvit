import { createAdminClient } from '@/lib/supabase/admin'
import type { CreateUserInput } from '@/services/users'

export async function createAuthUserWithProfile(input: CreateUserInput & {
  password: string
}) {
  const admin = createAdminClient()

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { name: input.name || null },
    })

  if (authError) {
    const msg = authError.message.toLowerCase()
    if (msg.includes('already') || msg.includes('registered')) {
      throw new Error('Ya existe un usuario con ese email en Authentication.')
    }
    throw new Error(authError.message)
  }

  if (!authData.user) {
    throw new Error('No se pudo crear el usuario en Authentication.')
  }

  const { error: profileError } = await admin.from('users').insert({
    id: authData.user.id,
    email: input.email,
    name: input.name || null,
    role: input.role,
    phone: input.phone || null,
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id)
    throw new Error(profileError.message)
  }

  return authData.user
}

export async function deleteAuthUser(userId: string) {
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
}
