'use client'

import Link from 'next/link'
import { deleteScheduleByIdAction } from '@/app/actions/schedules'

type Props = {
  scheduleId: string
  ticketId: string
  canManage: boolean
}

export default function ScheduleCardActions({
  scheduleId,
  ticketId,
  canManage,
}: Props) {
  if (!canManage) {
    return (
      <div className="mt-2">
        <Link
          href={`/tickets/${ticketId}`}
          className="text-primary hover:underline text-sm"
        >
          Ver ticket
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-2 flex flex-wrap gap-3 text-sm">
      <Link
        href={`/tickets/${ticketId}`}
        className="text-primary hover:underline"
      >
        Ver ticket
      </Link>
      <Link
        href={`/agenda/${scheduleId}`}
        className="text-primary hover:underline"
      >
        Reagendar
      </Link>
      <form
        action={deleteScheduleByIdAction}
        onSubmit={(e) => {
          if (!confirm('¿Eliminar esta cita?')) e.preventDefault()
        }}
      >
        <input type="hidden" name="id" value={scheduleId} />
        <button
          type="submit"
          className="text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </form>
    </div>
  )
}
