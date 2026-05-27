import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { canManageAgenda } from '@/lib/ticket-permissions'
import {
  addDays,
  formatYmd,
  getStartOfWeek,
  getWeekRangeIso,
  listSchedulesForRange,
} from '@/services/schedules'
import { SCHEDULE_STATUS_COLORS, SCHEDULE_STATUS_LABELS } from '@/lib/schedule-labels'
import ScheduleCardActions from '@/components/agenda/ScheduleCardActions'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function parseWeekStart(value?: string) {
  if (!value) return getStartOfWeek(new Date())
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return getStartOfWeek(new Date())
  return getStartOfWeek(date)
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week } = await searchParams
  const { supabase, profile, user } = await requireProfile()
  const canManage = canManageAgenda(profile.role)

  const weekStart = parseWeekStart(week)
  const nextWeek = addDays(weekStart, 7)
  const prevWeek = addDays(weekStart, -7)
  const { startIso, endIso } = getWeekRangeIso(weekStart)

  const schedules = await listSchedulesForRange(
    supabase,
    startIso,
    endIso,
    profile.role,
    user.id
  )

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const byDay = new Map<string, typeof schedules>()
  for (const day of days) byDay.set(formatYmd(day), [])
  for (const schedule of schedules) {
    const key = formatYmd(new Date(schedule.scheduled_start))
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(schedule)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Agenda semanal</h1>
          <p className="text-gray-500 mt-1">
            {canManage
              ? 'Programación de técnicos por semana'
              : 'Tus citas asignadas por semana'}
          </p>
        </div>
        {canManage && (
          <Link href="/agenda/nuevo" className={cn(buttonVariants(), 'inline-flex')}>
            Nueva cita
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/agenda?week=${formatYmd(prevWeek)}`}
          className="text-sm text-primary hover:underline"
        >
          ← Semana anterior
        </Link>
        <p className="text-sm text-gray-600">
          {formatYmd(weekStart)} al {formatYmd(addDays(weekStart, 6))}
        </p>
        <Link
          href={`/agenda?week=${formatYmd(nextWeek)}`}
          className="text-sm text-primary hover:underline"
        >
          Semana siguiente →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {days.map((day) => {
          const key = formatYmd(day)
          const daySchedules = byDay.get(key) ?? []

          return (
            <Card key={key}>
              <CardContent className="p-4 space-y-3">
                <h2 className="font-semibold">{formatDayLabel(day)}</h2>
                {daySchedules.length === 0 ? (
                  <p className="text-sm text-gray-500">Sin citas programadas</p>
                ) : (
                  <ul className="space-y-2">
                    {daySchedules.map((s) => (
                      <li key={s.id} className="border rounded-lg p-3 bg-white text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">
                            {formatTime(s.scheduled_start)}
                          </p>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-xs',
                              SCHEDULE_STATUS_COLORS[s.status]
                            )}
                          >
                            {SCHEDULE_STATUS_LABELS[s.status]}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">
                          {s.ticket?.client?.name ?? 'Sin cliente'} —{' '}
                          {s.ticket?.reported_issue?.slice(0, 55) ?? 'Sin descripción'}
                        </p>
                        <p className="text-gray-500 mt-1">
                          Técnico:{' '}
                          {s.technician?.name ?? s.technician?.email ?? 'Sin asignar'}
                        </p>
                        <ScheduleCardActions
                          scheduleId={s.id}
                          ticketId={s.ticket_id}
                          canManage={canManage}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}