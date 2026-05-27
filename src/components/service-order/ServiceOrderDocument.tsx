import { COMPANY, formatOrderNumber } from '@/lib/company'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/ticket-labels'
import type { TicketWithRelations } from '@/types/ticket'

function formatDate(value: string) {
  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}

type Props = {
  ticket: TicketWithRelations
}

export default function ServiceOrderDocument({ ticket }: Props) {
  const orderNo = formatOrderNumber(ticket.id, ticket.created_at)
  const client = ticket.client

  return (
    <article className="service-order max-w-[210mm] mx-auto bg-white text-black p-8 print:p-6">
      <header className="border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{COMPANY.name}</h1>
            <p className="text-sm text-gray-700 mt-1">{COMPANY.legalName}</p>
            {COMPANY.address && (
              <p className="text-xs text-gray-600 mt-2">{COMPANY.address}</p>
            )}
            {(COMPANY.phone || COMPANY.email) && (
              <p className="text-xs text-gray-600 mt-1">
                {[COMPANY.phone, COMPANY.email].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <div className="text-right text-sm shrink-0">
            <p className="font-bold text-lg">ORDEN DE SERVICIO</p>
            <p className="mt-2">
              <span className="text-gray-600">Folio:</span>{' '}
              <span className="font-mono font-semibold">{orderNo}</span>
            </p>
            <p className="mt-1">
              <span className="text-gray-600">Fecha:</span>{' '}
              {formatDate(ticket.created_at)}
            </p>
            <p className="mt-1">
              <span className="text-gray-600">Estado:</span>{' '}
              {STATUS_LABELS[ticket.status]}
            </p>
            <p className="mt-1">
              <span className="text-gray-600">Prioridad:</span>{' '}
              {PRIORITY_LABELS[ticket.priority]}
            </p>
          </div>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
          Datos del cliente
        </h2>
        <table className="w-full text-sm border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2 w-32 bg-gray-50 font-medium">Nombre</td>
              <td className="p-2">{client?.name ?? '—'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 bg-gray-50 font-medium">Teléfono</td>
              <td className="p-2">{client?.phone ?? '—'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-2 bg-gray-50 font-medium">Email</td>
              <td className="p-2">{client?.email ?? '—'}</td>
            </tr>
            <tr>
              <td className="p-2 bg-gray-50 font-medium align-top">Dirección</td>
              <td className="p-2 whitespace-pre-wrap">
                {client?.address ?? '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
          Servicio
        </h2>
        <p className="text-sm mb-2">
          <span className="font-medium">Técnico asignado:</span>{' '}
          {ticket.assignee?.name ?? ticket.assignee?.email ?? 'Sin asignar'}
        </p>
        <div className="border border-gray-300 p-3 mb-3 min-h-[80px]">
          <p className="text-xs font-bold text-gray-600 mb-1">
            Problema reportado
          </p>
          <p className="text-sm whitespace-pre-wrap">{ticket.reported_issue}</p>
        </div>
        <div className="border border-gray-300 p-3 min-h-[60px]">
          <p className="text-xs font-bold text-gray-600 mb-1">
            Trabajo realizado / observaciones
          </p>
          <p className="text-sm whitespace-pre-wrap">
            {ticket.possible_solution ?? ''}
          </p>
          {!ticket.possible_solution && (
            <p className="text-xs text-gray-400 italic">
              (Completar en sitio)
            </p>
          )}
        </div>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-8 text-sm">
        <div>
          <p className="font-bold text-xs uppercase text-gray-600 mb-8">
            Firma del cliente
          </p>
          <div className="border-b border-black h-10" />
          <p className="text-xs text-gray-500 mt-1">Nombre y firma</p>
        </div>
        <div>
          <p className="font-bold text-xs uppercase text-gray-600 mb-8">
            Firma del técnico
          </p>
          <div className="border-b border-black h-10" />
          <p className="text-xs text-gray-500 mt-1">Nombre y firma</p>
        </div>
      </section>

      <footer className="text-xs text-gray-500 border-t pt-3 text-center">
        Documento generado por Auvit Service Platform · {orderNo}
        {COMPANY.website && ` · ${COMPANY.website}`}
      </footer>
    </article>
  )
}
