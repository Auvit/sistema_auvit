import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LogoutButton from '@/components/layout/LogoutButton'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/services/users'

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const profile = user ? await getUserProfile(supabase, user.id) : null

  const message =
    params.reason === 'no_profile'
      ? 'No se pudo cargar tu perfil. Si acabas de configurar la base de datos, ejecuta el script 002_fix_rls_recursion.sql en Supabase. Si el problema continúa, contacta al administrador.'
      : 'No tienes permiso para acceder a esta sección.'

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6 text-center">
          <h1 className="text-2xl font-bold">Acceso no permitido</h1>
          <p className="text-gray-600 text-sm">{message}</p>

          <div className="flex flex-col gap-3">
            {profile && (
              <Link
                href="/dashboard"
                className={cn(buttonVariants(), 'w-full inline-flex justify-center')}
              >
                Volver al Dashboard
              </Link>
            )}

            {user && (
              <div className="flex justify-center">
                <LogoutButton
                  label="Cerrar sesión"
                  className="mt-0 pt-0 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg px-4 py-2 w-full justify-center"
                />
              </div>
            )}

            {!user && (
              <Link
                href="/login"
                className={cn(buttonVariants(), 'w-full inline-flex justify-center')}
              >
                Ir al Login
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
