import type { UserRole } from '@/types/user'
import type { Ticket } from '@/types/ticket'

const TICKET_MANAGER_ROLES: UserRole[] = [
  'admin',
  'receptionist',
  'operations',
]

export function canManageClients(role: UserRole) {
  return TICKET_MANAGER_ROLES.includes(role)
}

export function canCreateTicket(role: UserRole) {
  return TICKET_MANAGER_ROLES.includes(role)
}

export function canEditTicket(role: UserRole) {
  return TICKET_MANAGER_ROLES.includes(role)
}

export function canDeleteTicket(role: UserRole) {
  return role === 'admin'
}

export function canDeleteClient(role: UserRole) {
  return role === 'admin'
}

export function canTechnicianWorkTicket(
  role: UserRole,
  ticket: Pick<Ticket, 'assigned_to' | 'status'>,
  userId: string
) {
  if (role !== 'technician') return false
  if (ticket.assigned_to === userId) return true
  return ticket.assigned_to === null && ticket.status === 'open'
}

export function canUpdateTicket(
  role: UserRole,
  ticket: Pick<Ticket, 'assigned_to' | 'status'>,
  userId: string
) {
  return canEditTicket(role) || canTechnicianWorkTicket(role, ticket, userId)
}
