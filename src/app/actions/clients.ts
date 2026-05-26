'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { canDeleteClient, canManageClients } from '@/lib/ticket-permissions'
import {
  createClient as createClientRow,
  deleteClient,
  updateClient,
} from '@/services/clients'

function parseClientForm(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'El nombre es obligatorio.' as const }

  return {
    data: {
      name,
      phone: ((formData.get('phone') as string) || '').trim() || undefined,
      email: ((formData.get('email') as string) || '').trim() || undefined,
      address: ((formData.get('address') as string) || '').trim() || undefined,
      notes: ((formData.get('notes') as string) || '').trim() || undefined,
    },
  }
}

export async function createClientAction(formData: FormData) {
  const { supabase, profile } = await requireProfile()
  if (!canManageClients(profile.role)) redirect('/unauthorized')

  const parsed = parseClientForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { error } = await createClientRow(supabase, parsed.data)
  if (error) throw new Error(error.message)

  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function updateClientAction(id: string, formData: FormData) {
  const { supabase, profile } = await requireProfile()
  if (!canManageClients(profile.role)) redirect('/unauthorized')

  const parsed = parseClientForm(formData)
  if ('error' in parsed) throw new Error(parsed.error)

  const { error } = await updateClient(supabase, id, parsed.data)
  if (error) throw new Error(error.message)

  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
  redirect('/clientes')
}

export async function deleteClientAction(id: string) {
  const { supabase, profile } = await requireProfile()
  if (!canDeleteClient(profile.role)) redirect('/unauthorized')

  const { error } = await deleteClient(supabase, id)
  if (error) throw new Error(error.message)

  revalidatePath('/clientes')
  redirect('/clientes')
}
