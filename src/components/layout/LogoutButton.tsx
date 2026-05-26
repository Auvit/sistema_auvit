'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type LogoutButtonProps = {
  className?: string
  label?: string
}

export default function LogoutButton({
  className,
  label = 'Sign Out',
}: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        'mt-auto pt-6 text-left text-gray-400 hover:text-white transition-colors',
        className
      )}
    >
      {label}
    </button>
  )
}
