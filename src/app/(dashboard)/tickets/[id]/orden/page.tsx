import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { getTicket } from '@/services/tickets'
import ServiceOrderDocument from '@/components/service-order/ServiceOrderDocument'
import PrintOrderToolbar from '@/components/service-order/PrintOrderToolbar'
import {
  canEditTicket,
  canTechnicianWorkTicket,
} from '@/lib/ticket-permissions'

export default async function OrdenServicioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, profile, user } = await requireProfile()

  const ticket = await getTicket(supabase, id)
  if (!ticket) notFound()

  const canView =
    canEditTicket(profile.role) ||
    ticket.assigned_to === user.id ||
    canTechnicianWorkTicket(profile.role, ticket, user.id)

  if (!canView) notFound()

  return (
    <>
      <PrintOrderToolbar ticketId={id} />
      <div className="py-6 print:py-0">
        <ServiceOrderDocument ticket={ticket} />
      </div>
    </>
  )
}
