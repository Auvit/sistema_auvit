import type { TicketPriority, TicketStatus } from '@/types/ticket'

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Abierto',
  assigned: 'Asignado',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
  closed: 'Cerrado',
  cancelled: 'Cancelado',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}

export const STATUS_COLORS: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  critical: 'text-red-600 font-semibold',
}
