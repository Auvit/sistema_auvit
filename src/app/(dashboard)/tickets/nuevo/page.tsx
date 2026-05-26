import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createTicketAction } from '@/app/actions/tickets'
import TicketForm from '@/components/tickets/TicketForm'
import { requireProfile } from '@/lib/auth'
import { canCreateTicket } from '@/lib/ticket-permissions'
import { listClients } from '@/services/clients'
import { listTechnicians } from '@/services/tickets'

export default async function NuevoTicketPage() {
  const { supabase, profile } = await requireProfile()
  if (!canCreateTicket(profile.role)) redirect('/unauthorized')

  const [clients, technicians] = await Promise.all([
    listClients(supabase),
    listTechnicians(supabase),
  ])

  if (clients.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Nuevo ticket</h1>
        <p className="text-gray-600">
          Primero debes{' '}
          <Link href="/clientes/nuevo" className="text-primary underline">
            crear un cliente
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/tickets" className="text-sm text-gray-500 hover:underline">
          ← Volver a tickets
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo ticket</h1>
      </div>
      <TicketForm
        action={createTicketAction}
        clients={clients}
        technicians={technicians}
        submitLabel="Crear ticket"
      />
    </div>
  )
}
