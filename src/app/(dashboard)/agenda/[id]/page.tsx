import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  deleteScheduleAction,
  updateScheduleAction,
} from '@/app/actions/schedules'
import ScheduleForm from '@/components/agenda/ScheduleForm'
import { requireProfile } from '@/lib/auth'
import { canManageAgenda } from '@/lib/ticket-permissions'
import { getScheduleById } from '@/services/schedules'
import { listTechnicians, listTickets } from '@/services/tickets'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function EditarCitaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, profile } = await requireProfile()
  if (!canManageAgenda(profile.role)) redirect('/unauthorized')

  const [schedule, tickets, technicians] = await Promise.all([
    getScheduleById(supabase, id),
    listTickets(supabase),
    listTechnicians(supabase),
  ])

  if (!schedule) notFound()

  const updateAction = updateScheduleAction.bind(null, id)
  const deleteAction = deleteScheduleAction.bind(null, id)

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/agenda" className="text-sm text-gray-500 hover:underline">
          ← Volver a agenda
        </Link>
        <h1 className="text-3xl font-bold mt-2">Reagendar / editar cita</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cambia fecha, técnico o estado de la cita.
        </p>
      </div>

      <ScheduleForm
        action={updateAction}
        schedule={schedule}
        tickets={tickets}
        technicians={technicians}
        submitLabel="Guardar cambios"
      />

      <form action={deleteAction}>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: 'destructive' }))}
        >
          Eliminar cita
        </button>
      </form>
    </div>
  )
}
