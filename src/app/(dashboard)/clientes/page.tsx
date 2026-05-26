import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { canManageClients } from '@/lib/ticket-permissions'
import { listClients } from '@/services/clients'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function ClientesPage() {
  const { supabase, profile } = await requireProfile()
  const clients = await listClients(supabase)
  const canManage = canManageClients(profile.role)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-500 mt-1">Base de datos de clientes</p>
        </div>
        {canManage && (
          <Link
            href="/clientes/nuevo"
            className={cn(buttonVariants(), 'inline-flex')}
          >
            Nuevo cliente
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Teléfono</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Dirección</th>
                {canManage && <th className="p-4 font-medium" />}
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 5 : 4}
                    className="p-4 text-gray-500"
                  >
                    No hay clientes. Crea el primero para registrar tickets.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{client.name}</td>
                    <td className="p-4">{client.phone ?? '—'}</td>
                    <td className="p-4">{client.email ?? '—'}</td>
                    <td className="p-4">{client.address ?? '—'}</td>
                    {canManage && (
                      <td className="p-4 text-right">
                        <Link
                          href={`/clientes/${client.id}`}
                          className="text-primary hover:underline"
                        >
                          Editar
                        </Link>
                      </td>
                    )}
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
