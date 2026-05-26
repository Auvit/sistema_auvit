import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { canCreateTicket } from '@/lib/ticket-permissions'
import { listTickets } from '@/services/tickets'
import { PriorityLabel, StatusBadge } from '@/components/tickets/TicketBadges'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function TicketsPage() {
  const { supabase, profile } = await requireProfile()
  const tickets = await listTickets(supabase)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-gray-500 mt-1">Gestión de servicios</p>
        </div>
        {canCreateTicket(profile.role) && (
          <Link
            href="/tickets/nuevo"
            className={cn(buttonVariants(), 'inline-flex')}
          >
            Nuevo ticket
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Problema</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium">Prioridad</th>
                <th className="p-4 font-medium">Técnico</th>
                <th className="p-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-gray-500">
                    No hay tickets registrados.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{ticket.client?.name}</td>
                    <td className="p-4 max-w-xs truncate">
                      {ticket.reported_issue}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="p-4">
                      <PriorityLabel priority={ticket.priority} />
                    </td>
                    <td className="p-4">
                      {ticket.assignee?.name ?? ticket.assignee?.email ?? '—'}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="text-primary hover:underline"
                      >
                        Ver
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
