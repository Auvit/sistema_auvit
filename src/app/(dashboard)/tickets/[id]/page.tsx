import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  deleteTicketAction,
  takeTicketAction,
  updateTicketAction,
} from '@/app/actions/tickets'
import TicketForm from '@/components/tickets/TicketForm'
import { PriorityLabel, StatusBadge } from '@/components/tickets/TicketBadges'
import { requireProfile } from '@/lib/auth'
import { STATUS_LABELS } from '@/lib/ticket-labels'
import {
  canCreateTicket,
  canDeleteTicket,
  canEditTicket,
  canTechnicianWorkTicket,
  canUpdateTicket,
} from '@/lib/ticket-permissions'
import { listClients } from '@/services/clients'
import {
  getTicket,
  getTicketHistory,
  listTechnicians,
} from '@/services/tickets'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default async function TicketDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, profile, user } = await requireProfile()

  const ticket = await getTicket(supabase, id)
  if (!ticket) notFound()

  const [history, clients, technicians] = await Promise.all([
    getTicketHistory(supabase, id),
    canEditTicket(profile.role) ? listClients(supabase) : Promise.resolve([]),
    canEditTicket(profile.role)
      ? listTechnicians(supabase)
      : Promise.resolve([]),
  ])

  const canUpdate = canUpdateTicket(profile.role, ticket, user.id)
  const canTake =
    canTechnicianWorkTicket(profile.role, ticket, user.id) &&
    ticket.status === 'open' &&
    !ticket.assigned_to
  const technicianMode =
    profile.role === 'technician' && !canEditTicket(profile.role)
  const updateAction = updateTicketAction.bind(null, id)
  const deleteAction = deleteTicketAction.bind(null, id)
  const takeAction = takeTicketAction.bind(null, id)

  return (
    <div className="p-6 space-y-8">
      <div>
        <Link href="/tickets" className="text-sm text-gray-500 hover:underline">
          ← Volver a tickets
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <h1 className="text-3xl font-bold">Ticket</h1>
          <StatusBadge status={ticket.status} />
          <PriorityLabel priority={ticket.priority} />
        </div>
        <p className="text-gray-500 mt-1">
          Cliente: <span className="font-medium text-gray-800">{ticket.client?.name}</span>
          {ticket.client?.phone && ` · ${ticket.client.phone}`}
        </p>
        <Link
          href={`/tickets/${id}/orden`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex mt-4')}
        >
          Imprimir orden de servicio
        </Link>
      </div>

      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="font-semibold">Problema reportado</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.reported_issue}</p>
          {ticket.possible_solution && (
            <>
              <h2 className="font-semibold pt-2">Posible solución</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.possible_solution}
              </p>
            </>
          )}
          <p className="text-sm text-gray-500 pt-2">
            Técnico:{' '}
            {ticket.assignee?.name ?? ticket.assignee?.email ?? 'Sin asignar'}
          </p>
        </CardContent>
      </Card>

      {canTake && (
        <form action={takeAction}>
          <button type="submit" className={cn(buttonVariants(), 'inline-flex')}>
            Tomar ticket
          </button>
        </form>
      )}

      {canUpdate && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Actualizar ticket</h2>
          <TicketForm
            action={updateAction}
            clients={clients}
            technicians={technicians}
            ticket={ticket}
            submitLabel="Guardar cambios"
            technicianMode={technicianMode}
          />
        </div>
      )}

      {canDeleteTicket(profile.role) && (
        <form action={deleteAction}>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Eliminar ticket
          </button>
        </form>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Historial</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin entradas en el historial.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="border rounded-lg p-4 bg-white text-sm"
              >
                <div className="flex justify-between text-gray-500 text-xs mb-1">
                  <span>
                    {entry.author?.name ?? entry.author?.email ?? 'Usuario'}
                  </span>
                  <time dateTime={entry.created_at}>
                    {new Date(entry.created_at).toLocaleString('es-MX')}
                  </time>
                </div>
                {entry.status && (
                  <p className="font-medium text-gray-800">
                    Estado: {STATUS_LABELS[entry.status]}
                  </p>
                )}
                {entry.notes && (
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {entry.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
