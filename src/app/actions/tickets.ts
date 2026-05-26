'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import {
  canCreateTicket,
  canDeleteTicket,
  canEditTicket,
  canTechnicianWorkTicket,
  canUpdateTicket,
} from '@/lib/ticket-permissions'
import { isTicketPriority, isTicketStatus } from '@/types/ticket'
import {
  addTicketHistory,
  createTicket,
  deleteTicket,
  getTicket,
  updateTicket,
} from '@/services/tickets'

function parseTicketForm(formData: FormData) {
  const client_id = formData.get('client_id') as string
  const priority = formData.get('priority') as string
  const status = formData.get('status') as string
  const reported_issue = (formData.get('reported_issue') as string)?.trim()
  const possible_solution =
    ((formData.get('possible_solution') as string) || '').trim() || null
  const assigned_to = (formData.get('assigned_to') as string) || null
  const notes = ((formData.get('notes') as string) || '').trim() || null

  if (!client_id) return { error: 'Selecciona un cliente.' as const }
  if (!isTicketPriority(priority)) return { error: 'Prioridad inválida.' as const }
  if (!isTicketStatus(status)) return { error: 'Estado inválido.' as const }
  if (!reported_issue) return { error: 'Describe el problema reportado.' as const }

  return {
    data: {
      client_id,
      priority,
      status,
      reported_issue,
      possible_solution,
      assigned_to: assigned_to || null,
      notes,
    },
  }
}

export async function createTicketAction(formData: FormData) {
  const { supabase, profile, user } = await requireProfile()
  if (!canCreateTicket(profile.role)) redirect('/unauthorized')

  const parsed = parseTicketForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { notes, assigned_to, ...ticketData } = parsed.data

  const { data: ticket, error } = await createTicket(supabase, {
    ...ticketData,
    assigned_to,
    status:
      assigned_to && ticketData.status === 'open'
        ? 'assigned'
        : ticketData.status,
  })

  if (error || !ticket) throw new Error(error?.message ?? 'Error al crear ticket.')

  await addTicketHistory(supabase, {
    ticket_id: ticket.id,
    notes: notes ?? 'Ticket creado',
    status: ticket.status,
    created_by: user.id,
  })

  revalidatePath('/tickets')
  redirect(`/tickets/${ticket.id}`)
}

export async function updateTicketAction(id: string, formData: FormData) {
  const { supabase, profile, user } = await requireProfile()

  const existing = await getTicket(supabase, id)
  if (!existing) throw new Error('Ticket no encontrado.')

  if (!canUpdateTicket(profile.role, existing, user.id)) {
    redirect('/unauthorized')
  }

  const parsed = parseTicketForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { notes, ...ticketData } = parsed.data

  const isTechnicianOnly =
    profile.role === 'technician' && !canEditTicket(profile.role)

  const updatePayload = isTechnicianOnly
    ? {
        status: ticketData.status,
        possible_solution: ticketData.possible_solution,
      }
    : ticketData

  const { data: ticket, error } = await updateTicket(supabase, id, updatePayload)
  if (error || !ticket) throw new Error(error?.message ?? 'Error al actualizar.')

  const statusChanged = existing.status !== ticket.status
  if (notes || statusChanged) {
    await addTicketHistory(supabase, {
      ticket_id: id,
      notes: notes ?? (statusChanged ? `Estado: ${ticket.status}` : null),
      status: ticket.status,
      created_by: user.id,
    })
  }

  revalidatePath('/tickets')
  revalidatePath(`/tickets/${id}`)
  redirect(`/tickets/${id}`)
}

export async function takeTicketAction(id: string) {
  const { supabase, profile, user } = await requireProfile()

  const existing = await getTicket(supabase, id)
  if (!existing) throw new Error('Ticket no encontrado.')

  if (!canTechnicianWorkTicket(profile.role, existing, user.id)) {
    redirect('/unauthorized')
  }

  const { error } = await updateTicket(supabase, id, {
    assigned_to: user.id,
    status: 'assigned',
  })

  if (error) throw new Error(error.message)

  await addTicketHistory(supabase, {
    ticket_id: id,
    notes: 'Ticket tomado por el técnico',
    status: 'assigned',
    created_by: user.id,
  })

  revalidatePath('/tickets')
  revalidatePath(`/tickets/${id}`)
  redirect(`/tickets/${id}`)
}

export async function deleteTicketAction(id: string) {
  const { supabase, profile } = await requireProfile()
  if (!canDeleteTicket(profile.role)) redirect('/unauthorized')

  const { error } = await deleteTicket(supabase, id)
  if (error) throw new Error(error.message)

  revalidatePath('/tickets')
  redirect('/tickets')
}
