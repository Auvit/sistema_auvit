'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { canManageAgenda } from '@/lib/ticket-permissions'
import { isScheduleStatus } from '@/types/schedule'
import {
  createSchedule,
  deleteSchedule,
  formatYmd,
  parseDatetimeLocal,
  updateSchedule,
} from '@/services/schedules'

function parseScheduleForm(formData: FormData, createdBy: string) {
  const ticketId = ((formData.get('ticket_id') as string) || '').trim()
  const technicianId = ((formData.get('technician_id') as string) || '').trim()
  const start = ((formData.get('scheduled_start') as string) || '').trim()
  const end = ((formData.get('scheduled_end') as string) || '').trim()
  const status = ((formData.get('status') as string) || '').trim()
  const notes = ((formData.get('notes') as string) || '').trim()

  if (!ticketId) throw new Error('Selecciona un ticket.')
  if (!technicianId) throw new Error('Selecciona un técnico.')
  if (!start) throw new Error('La fecha y hora son obligatorias.')
  if (!isScheduleStatus(status)) throw new Error('Estado de cita inválido.')

  const startDate = parseDatetimeLocal(start)
  if (Number.isNaN(startDate.getTime())) {
    throw new Error('Formato de fecha inválido.')
  }

  let endDate: Date
  if (end) {
    endDate = parseDatetimeLocal(end)
    if (Number.isNaN(endDate.getTime())) {
      throw new Error('Formato de fecha inválido.')
    }
    if (endDate <= startDate) {
      throw new Error('La hora final debe ser mayor a la inicial.')
    }
  } else {
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
  }

  return {
    ticket_id: ticketId,
    technician_id: technicianId,
    scheduled_start: startDate.toISOString(),
    scheduled_end: endDate.toISOString(),
    status,
    notes: notes || null,
    created_by: createdBy,
  }
}

export async function createScheduleAction(formData: FormData) {
  const { supabase, user, profile } = await requireProfile()
  if (!canManageAgenda(profile.role)) redirect('/unauthorized')

  const input = parseScheduleForm(formData, user.id)
  const { error } = await createSchedule(supabase, input)
  if (error) throw new Error(error.message)

  const weekParam = formatYmd(new Date(input.scheduled_start))
  revalidatePath('/agenda')
  redirect(`/agenda?week=${weekParam}`)
}

export async function updateScheduleAction(id: string, formData: FormData) {
  const { supabase, user, profile } = await requireProfile()
  if (!canManageAgenda(profile.role)) redirect('/unauthorized')

  const input = parseScheduleForm(formData, user.id)
  const { error } = await updateSchedule(supabase, id, input)
  if (error) throw new Error(error.message)

  const weekParam = formatYmd(new Date(input.scheduled_start))
  revalidatePath('/agenda')
  revalidatePath(`/agenda/${id}`)
  redirect(`/agenda?week=${weekParam}`)
}

export async function deleteScheduleAction(id: string) {
  const { supabase, profile } = await requireProfile()
  if (!canManageAgenda(profile.role)) redirect('/unauthorized')

  const { error } = await deleteSchedule(supabase, id)
  if (error) throw new Error(error.message)

  revalidatePath('/agenda')
  redirect('/agenda')
}

export async function deleteScheduleByIdAction(formData: FormData) {
  const id = (formData.get('id') as string)?.trim()
  if (!id) throw new Error('Cita no válida.')
  await deleteScheduleAction(id)
}
