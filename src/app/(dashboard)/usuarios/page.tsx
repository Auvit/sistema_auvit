import Link from 'next/link'
import { listUsers } from '@/services/users'
import { requireAdmin } from '@/lib/auth'
import { ROLE_LABELS } from '@/lib/permissions'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function UsuariosPage() {
  const { supabase } = await requireAdmin()

  const users = await listUsers(supabase)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-gray-500 mt-1">
            Gestión de perfiles y roles (solo administradores).
          </p>
        </div>
        <Link
          href="/usuarios/nuevo"
          className={cn(buttonVariants(), 'inline-flex')}
        >
          Agregar usuario
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Rol</th>
                <th className="p-4 font-medium">Teléfono</th>
                <th className="p-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-4">{u.name ?? '—'}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{ROLE_LABELS[u.role]}</td>
                    <td className="p-4">{u.phone ?? '—'}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/usuarios/${u.id}`}
                        className="text-primary hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
