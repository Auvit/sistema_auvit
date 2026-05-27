/**
 * Datos de la empresa para orden de servicio.
 * Más adelante: logo en /public, variables de entorno, membrete PDF.
 */
export const COMPANY = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? 'Auvit',
  legalName:
    process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ?? 'Auvit — Domótica y Servicio',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? '',
  website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE ?? '',
}

export function formatOrderNumber(ticketId: string, createdAt: string) {
  const date = new Date(createdAt)
  const y = date.getFullYear()
  const seq = ticketId.replace(/-/g, '').slice(0, 8).toUpperCase()
  return `OS-${y}-${seq}`
}
