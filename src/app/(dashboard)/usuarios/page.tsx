import { createClient } from '@/lib/supabase/server'
import { listUsers } from '@/services/users'
import { ROLE_LABELS } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default async function UsuariosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUser?.role !== 'admin') {
    redirect('/unauthorized')
  }

  const users = await listUsers(supabase)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-gray-500 mt-1">
          Solo administradores pueden gestionar usuarios. La creación desde la
          app se implementará en una etapa siguiente; por ahora usa Supabase
          Authentication + tabla <code className="text-sm">users</code>.
        </p>
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
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-gray-500">
                    No hay usuarios registrados. Ejecuta la migración SQL y
                    crea perfiles en Supabase.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-4">{u.name ?? '—'}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{ROLE_LABELS[u.role]}</td>
                    <td className="p-4">{u.phone ?? '—'}</td>
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
