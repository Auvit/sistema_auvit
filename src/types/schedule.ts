export const SCHEDULE_STATUSES = ['scheduled', 'completed', 'cancelled'] as const

export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number]

export type Schedule = {
  id: string
  ticket_id: string
  technician_id: string
  scheduled_start: string
  scheduled_end: string
  status: ScheduleStatus
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type ScheduleWithRelations = Schedule & {
  ticket: {
    id: string
    reported_issue: string
    status: string
    client?: { name: string } | null
  } | null
  technician: { id: string; name: string | null; email: string } | null
}

export function isScheduleStatus(value: string): value is ScheduleStatus {
  return (SCHEDULE_STATUSES as readonly string[]).includes(value)
}
