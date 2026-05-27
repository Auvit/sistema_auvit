import type { ScheduleStatus } from '@/types/schedule'

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  scheduled: 'Programada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export const SCHEDULE_STATUS_COLORS: Record<ScheduleStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}
