import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { getDashboardData } from '@/services/dashboard'
import { PriorityLabel, StatusBadge } from '@/components/tickets/TicketBadges'
import { Card, CardContent } from '@/components/ui/card'

export default async function DashboardPage() {
  const { supabase, profile } = await requireProfile()
  const { metrics, recentTickets } = await getDashboardData(
    supabase,
    profile.role,
    profile.id
  )

  const isTechnician = profile.role === 'technician'

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {isTechnician
            ? 'Resumen de tus tickets asignados'
            : 'Resumen operativo de Auvit Service Platform'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">
              {isTechnician ? 'Mis tickets activos' : 'Tickets activos'}
            </h2>
            <p className="text-3xl font-bold mt-2">{metrics.openTickets}</p>
            <p className="text-xs text-gray-400 mt-1">
              Sin cerrar ni cancelar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Tickets críticos</h2>
            <p className="text-3xl font-bold mt-2 text-red-500">
              {metrics.criticalTickets}
            </p>
            <p className="text-xs text-gray-400 mt-1">Prioridad crítica</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">
              {isTechnician ? 'En progreso' : 'Técnicos activos'}
            </h2>
            <p className="text-3xl font-bold mt-2">
              {isTechnician
                ? recentTickets.filter((t) => t.status === 'in_progress')
                    .length
                : metrics.activeTechnicians}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {isTechnician
                ? 'Tickets en trabajo'
                : 'Con servicios asignados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm text-gray-500">Servicios pendientes</h2>
            <p className="text-3xl font-bold mt-2">
              {metrics.pendingServices}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Abierto, asignado o en progreso
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {isTechnician ? 'Mis tickets recientes' : 'Tickets recientes'}
            </h2>
            <Link href="/tickets" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <p className="text-sm text-gray-500">
              {isTechnician
                ? 'No tienes tickets asignados.'
                : 'No hay tickets registrados.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Problema</th>
                    <th className="pb-3 font-medium">Estado</th>
                    <th className="pb-3 font-medium">Prioridad</th>
                    {!isTechnician && (
                      <th className="pb-3 font-medium">Técnico</th>
                    )}
                    <th className="pb-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">
                        {ticket.client?.name ?? '—'}
                      </td>
                      <td className="py-3 max-w-xs truncate">
                        {ticket.reported_issue}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3">
                        <PriorityLabel priority={ticket.priority} />
                      </td>
                      {!isTechnician && (
                        <td className="py-3">
                          {ticket.assignee?.name ??
                            ticket.assignee?.email ??
                            '—'}
                        </td>
                      )}
                      <td className="py-3 text-right">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="text-primary hover:underline"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
