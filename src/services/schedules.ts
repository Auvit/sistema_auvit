import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types/user'
import type { Schedule, ScheduleStatus, ScheduleWithRelations } from '@/types/schedule'

export type ScheduleInput = {
  ticket_id: string
  technician_id: string
  scheduled_start: string
  scheduled_end: string
  status: ScheduleStatus
  notes?: string | null
  created_by: string
}

export function getStartOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatYmd(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parsea datetime-local (YYYY-MM-DDTHH:mm) en hora local del servidor */
export function parseDatetimeLocal(value: string): Date {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return new Date(NaN)
  const y = Number(match[1])
  const mo = Number(match[2])
  const d = Number(match[3])
  const h = Number(match[4])
  const mi = Number(match[5])
  return new Date(y, mo - 1, d, h, mi, 0, 0)
}

export function getWeekRangeIso(weekStart: Date) {
  const start = new Date(weekStart)
  start.setHours(0, 0, 0, 0)
  const end = addDays(start, 7)
  end.setHours(0, 0, 0, 0)
  return { startIso: start.toISOString(), endIso: end.toISOString() }
}

async function enrichSchedules(
  supabase: SupabaseClient,
  rows: Schedule[]
): Promise<ScheduleWithRelations[]> {
  if (rows.length === 0) return []

  const ticketIds = [...new Set(rows.map((r) => r.ticket_id))]
  const technicianIds = [...new Set(rows.map((r) => r.technician_id))]

  const [{ data: tickets }, { data: technicians }] = await Promise.all([
    supabase
      .from('tickets')
      .select('id, reported_issue, status, client:clients ( name )')
      .in('id', ticketIds),
    supabase
      .from('users')
      .select('id, name, email')
      .in('id', technicianIds),
  ])

  const ticketMap = new Map((tickets ?? []).map((t) => [t.id, t]))
  const techMap = new Map((technicians ?? []).map((t) => [t.id, t]))

  return rows.map((row) => ({
    ...row,
    ticket: ticketMap.get(row.ticket_id) ?? null,
    technician: techMap.get(row.technician_id) ?? null,
  })) as ScheduleWithRelations[]
}

export async function listSchedulesForRange(
  supabase: SupabaseClient,
  startIso: string,
  endIso: string,
  role: UserRole,
  userId: string
): Promise<ScheduleWithRelations[]> {
  let query = supabase
    .from('schedules')
    .select('*')
    .gte('scheduled_start', startIso)
    .lt('scheduled_start', endIso)
    .order('scheduled_start', { ascending: true })

  if (role === 'technician') {
    query = query.eq('technician_id', userId)
  }

  const { data, error } = await query
  if (error || !data) return []

  return enrichSchedules(supabase, data as Schedule[])
}

export async function getScheduleById(
  supabase: SupabaseClient,
  id: string
): Promise<ScheduleWithRelations | null> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  const enriched = await enrichSchedules(supabase, [data as Schedule])
  return enriched[0] ?? null
}

export async function createSchedule(
  supabase: SupabaseClient,
  input: ScheduleInput
) {
  return supabase.from('schedules').insert(input).select().single()
}

export async function updateSchedule(
  supabase: SupabaseClient,
  id: string,
  input: Partial<ScheduleInput>
) {
  return supabase.from('schedules').update(input).eq('id', id).select().single()
}

export async function deleteSchedule(supabase: SupabaseClient, id: string) {
  return supabase.from('schedules').delete().eq('id', id)
}
