import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/services/users'
import type { UserProfile } from '@/types/user'

export async function requireProfile(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>
  user: { id: string; email?: string }
  profile: UserProfile
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await getUserProfile(supabase, user.id)
  if (!profile) redirect('/unauthorized?reason=no_profile')

  return { supabase, user, profile }
}

export async function requireAdmin() {
  const auth = await requireProfile()
  if (auth.profile.role !== 'admin') redirect('/unauthorized')
  return auth
}
