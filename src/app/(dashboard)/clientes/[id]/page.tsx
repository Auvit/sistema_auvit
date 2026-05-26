import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  deleteClientAction,
  updateClientAction,
} from '@/app/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import { requireProfile } from '@/lib/auth'
import { canDeleteClient, canManageClients } from '@/lib/ticket-permissions'
import { getClient } from '@/services/clients'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, profile } = await requireProfile()
  if (!canManageClients(profile.role)) redirect('/unauthorized')

  const client = await getClient(supabase, id)
  if (!client) notFound()

  const updateAction = updateClientAction.bind(null, id)
  const deleteAction = deleteClientAction.bind(null, id)

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/clientes" className="text-sm text-gray-500 hover:underline">
          ← Volver a clientes
        </Link>
        <h1 className="text-3xl font-bold mt-2">Editar cliente</h1>
      </div>

      <ClientForm
        action={updateAction}
        client={client}
        submitLabel="Guardar cambios"
      />

      {canDeleteClient(profile.role) && (
        <form action={deleteAction}>
          <button
            type="submit"
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'mt-4'
            )}
          >
            Eliminar cliente
          </button>
        </form>
      )}
    </div>
  )
}
