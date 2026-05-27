import Link from 'next/link'
import CreateUserForm from '@/components/users/CreateUserForm'
import { createUserAction } from '@/app/actions/users'
import { requireAdmin } from '@/lib/auth'
import { isAdminClientConfigured } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'

export default async function NuevoUsuarioPage() {
  await requireAdmin()
  const adminReady = isAdminClientConfigured()

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/usuarios" className="text-sm text-gray-500 hover:underline">
          ← Volver a usuarios
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo usuario</h1>
        <p className="text-sm text-gray-500 mt-1">
          Crea la cuenta y el perfil en un solo paso (solo administradores).
        </p>
      </div>

      {!adminReady ? (
        <Card>
          <CardContent className="p-6 space-y-3 text-sm text-gray-700">
            <p className="font-medium text-amber-800">
              Falta configurar la clave de administrador de Supabase
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Supabase Dashboard → <strong>Settings → API</strong>
              </li>
              <li>
                Copia <strong>service_role</strong> (secret, no la anon key)
              </li>
              <li>
                En <code className="text-xs bg-gray-100 px-1 rounded">.env.local</code>{' '}
                agrega:{' '}
                <code className="text-xs bg-gray-100 px-1 rounded block mt-1">
                  SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui
                </code>
              </li>
              <li>Reinicia <code className="text-xs">npm run dev</code></li>
            </ol>
            <p className="text-xs text-gray-500">
              Nunca subas esa clave a GitHub. Solo va en tu máquina o en variables
              de entorno de Vercel.
            </p>
          </CardContent>
        </Card>
      ) : (
        <CreateUserForm action={createUserAction} />
      )}
    </div>
  )
}
