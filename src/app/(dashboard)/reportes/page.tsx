import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { getReportsData } from '@/services/reports'
import { PRIORITY_COLORS, STATUS_COLORS } from '@/lib/ticket-labels'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function ReportesPage() {
  const { supabase, profile, user } = await requireProfile()
  const isTechnician = profile.role === 'technician'

  const { summary, byStatus, byPriority, byTechnician, recentClosed } =
    await getReportsData(supabase, profile.role, user.id)

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="text-gray-500 mt-1">
          {isTechnician
            ? 'Resumen de tus tickets asignados'
            : 'Métricas operativas del departamento de servicio'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total tickets</p>
            <p className="text-3xl font-bold mt-1">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Activos</p>
            <p className="text-3xl font-bold mt-1">{summary.active}</p>
            <p className="text-xs text-gray-400 mt-1">Sin cerrar ni cancelar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Resueltos (sin pagar)</p>
            <p className="text-3xl font-bold mt-1 text-green-600">
              {summary.resolved}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Cerrados (pagados)</p>
            <p className="text-3xl font-bold mt-1">{summary.closed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">En trabajo pendiente</p>
            <p className="text-2xl font-bold mt-1">{summary.pendingWork}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Críticos activos</p>
            <p className="text-2xl font-bold mt-1 text-red-600">
              {summary.criticalActive}
            </p>
          </CardContent>
        </Card>
        {!isTechnician && (
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">Sin técnico asignado</p>
              <p className="text-2xl font-bold mt-1">{summary.unassigned}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tickets por estado</h2>
            <table className="w-full text-sm">
              <tbody>
                {byStatus.map((row) => (
                  <tr key={row.status} className="border-b last:border-0">
                    <td className="py-2">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                          STATUS_COLORS[row.status]
                        )}
                      >
                        {row.label}
                      </span>
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {row.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tickets por prioridad</h2>
            <table className="w-full text-sm">
              <tbody>
                {byPriority.map((row) => (
                  <tr key={row.priority} className="border-b last:border-0">
                    <td className={cn('py-2', PRIORITY_COLORS[row.priority])}>
                      {row.label}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {row.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {!isTechnician && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Rendimiento por técnico</h2>
            {byTechnician.length === 0 ? (
              <p className="text-sm text-gray-500">Sin datos de técnicos.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Técnico</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                      <th className="pb-3 font-medium text-right">Pendientes</th>
                      <th className="pb-3 font-medium text-right">Resueltos</th>
                      <th className="pb-3 font-medium text-right">Cerrados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byTechnician.map((row) => (
                      <tr
                        key={row.technicianId ?? 'unassigned'}
                        className="border-b last:border-0"
                      >
                        <td className="py-3 font-medium">{row.name}</td>
                        <td className="py-3 text-right">{row.total}</td>
                        <td className="py-3 text-right">{row.pending}</td>
                        <td className="py-3 text-right text-green-700">
                          {row.resolved}
                        </td>
                        <td className="py-3 text-right">{row.closed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recientes resueltos / cerrados
          </h2>
          {recentClosed.length === 0 ? (
            <p className="text-sm text-gray-500">No hay tickets en esta categoría.</p>
          ) : (
            <ul className="space-y-2">
              {recentClosed.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {t.client?.name ?? 'Cliente'} — {t.reported_issue.slice(0, 50)}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {t.assignee?.name ?? t.assignee?.email ?? 'Sin técnico'}
                    </p>
                  </div>
                  <Link
                    href={`/tickets/${t.id}`}
                    className="text-primary hover:underline shrink-0"
                  >
                    Ver ticket
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
