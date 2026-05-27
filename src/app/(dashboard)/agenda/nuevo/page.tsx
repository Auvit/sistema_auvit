import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createScheduleAction } from '@/app/actions/schedules'
import ScheduleForm from '@/components/agenda/ScheduleForm'
import { requireProfile } from '@/lib/auth'
import { canManageAgenda } from '@/lib/ticket-permissions'
import { listTechnicians, listTickets } from '@/services/tickets'

export default async function NuevaCitaPage() {
  const { supabase, profile } = await requireProfile()
  if (!canManageAgenda(profile.role)) redirect('/unauthorized')

  const [tickets, technicians] = await Promise.all([
    listTickets(supabase),
    listTechnicians(supabase),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/agenda" className="text-sm text-gray-500 hover:underline">
          ← Volver a agenda
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nueva cita</h1>
      </div>

      <ScheduleForm
        action={createScheduleAction}
        tickets={tickets}
        technicians={technicians}
        submitLabel="Guardar cita"
      />
    </div>
  )
}
