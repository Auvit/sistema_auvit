import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClientAction } from '@/app/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import { requireProfile } from '@/lib/auth'
import { canManageClients } from '@/lib/ticket-permissions'

export default async function NuevoClientePage() {
  const { profile } = await requireProfile()
  if (!canManageClients(profile.role)) redirect('/unauthorized')

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/clientes" className="text-sm text-gray-500 hover:underline">
          ← Volver a clientes
        </Link>
        <h1 className="text-3xl font-bold mt-2">Nuevo cliente</h1>
      </div>
      <ClientForm action={createClientAction} submitLabel="Guardar cliente" />
    </div>
  )
}
