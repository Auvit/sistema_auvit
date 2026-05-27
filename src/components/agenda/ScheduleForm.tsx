import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SCHEDULE_STATUSES, type ScheduleWithRelations } from '@/types/schedule'
import { SCHEDULE_STATUS_LABELS } from '@/lib/schedule-labels'
import type { TicketWithRelations } from '@/types/ticket'

type TechnicianOption = { id: string; name: string | null; email: string }

type Props = {
  action: (formData: FormData) => Promise<void>
  tickets: TicketWithRelations[]
  technicians: TechnicianOption[]
  schedule?: ScheduleWithRelations
  submitLabel: string
}

function toDatetimeLocal(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  const pad = (n: number) => `${n}`.padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function ScheduleForm({
  action,
  tickets,
  technicians,
  schedule,
  submitLabel,
}: Props) {
  return (
    <form action={action} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="ticket_id">Ticket *</Label>
        <select
          id="ticket_id"
          name="ticket_id"
          defaultValue={schedule?.ticket_id ?? ''}
          required
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Seleccionar ticket</option>
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.client?.name ?? 'Cliente'} - {t.reported_issue.slice(0, 60)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technician_id">Técnico *</Label>
        <select
          id="technician_id"
          name="technician_id"
          defaultValue={schedule?.technician_id ?? ''}
          required
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Seleccionar técnico</option>
          {technicians.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name ?? t.email}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduled_start">Fecha y hora *</Label>
        <Input
          id="scheduled_start"
          name="scheduled_start"
          type="datetime-local"
          defaultValue={toDatetimeLocal(schedule?.scheduled_start)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado *</Label>
        <select
          id="status"
          name="status"
          defaultValue={schedule?.status ?? 'scheduled'}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {SCHEDULE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {SCHEDULE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={schedule?.notes ?? ''}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
