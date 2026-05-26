import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '@/lib/ticket-labels'
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketWithRelations,
} from '@/types/ticket'
import type { Client } from '@/types/client'

type Technician = { id: string; name: string | null; email: string }

type TicketFormProps = {
  action: (formData: FormData) => Promise<void>
  clients: Client[]
  technicians: Technician[]
  ticket?: TicketWithRelations
  submitLabel: string
  readOnlyFields?: boolean
  technicianMode?: boolean
}

export default function TicketForm({
  action,
  clients,
  technicians,
  ticket,
  submitLabel,
  readOnlyFields = false,
  technicianMode = false,
}: TicketFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-2xl">
      {!technicianMode && (
        <>
          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente *</Label>
            <select
              id="client_id"
              name="client_id"
              defaultValue={ticket?.client_id ?? ''}
              required
              disabled={readOnlyFields}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad *</Label>
              <select
                id="priority"
                name="priority"
                defaultValue={ticket?.priority ?? 'medium'}
                disabled={readOnlyFields}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {TICKET_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to">Técnico asignado</Label>
              <select
                id="assigned_to"
                name="assigned_to"
                defaultValue={ticket?.assigned_to ?? ''}
                disabled={readOnlyFields}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Sin asignar</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name ?? t.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {technicianMode && ticket && (
        <>
          <input type="hidden" name="client_id" value={ticket.client_id} />
          <input type="hidden" name="priority" value={ticket.priority} />
          <input
            type="hidden"
            name="assigned_to"
            value={ticket.assigned_to ?? ''}
          />
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Estado *</Label>
        <select
          id="status"
          name="status"
          defaultValue={ticket?.status ?? 'open'}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {!technicianMode && (
        <div className="space-y-2">
          <Label htmlFor="reported_issue">Problema reportado *</Label>
          <textarea
            id="reported_issue"
            name="reported_issue"
            defaultValue={ticket?.reported_issue ?? ''}
            required
            disabled={readOnlyFields}
            rows={3}
            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      {technicianMode && ticket && (
        <input
          type="hidden"
          name="reported_issue"
          value={ticket.reported_issue}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="possible_solution">Posible solución</Label>
        <textarea
          id="possible_solution"
          name="possible_solution"
          defaultValue={ticket?.possible_solution ?? ''}
          rows={2}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Nota / comentario</Label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Opcional — se guarda en el historial"
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
