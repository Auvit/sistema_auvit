import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getNavItemsForRole, ROLE_LABELS } from '@/lib/permissions'
import { getUserProfile } from '@/services/users'
import LogoutButton from '@/components/layout/LogoutButton'

export default async function Sidebar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profile = user ? await getUserProfile(supabase, user.id) : null
  const navItems = profile ? getNavItemsForRole(profile.role) : []

  return (
    <aside className="w-64 bg-black text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-2">Auvit</h2>

      {profile && (
        <p className="text-xs text-gray-400 mb-6">
          {profile.name ?? profile.email}
          <span className="block text-gray-500 mt-0.5">
            {ROLE_LABELS[profile.role]}
          </span>
        </p>
      )}

      <nav className="flex flex-col gap-4 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-gray-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <LogoutButton />
    </aside>
  )
}
