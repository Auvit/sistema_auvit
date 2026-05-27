import Link from 'next/link'
import { notFound } from 'next/navigation'
import UserForm from '@/components/users/UserForm'
import {
  deleteUserProfileAction,
  updateUserProfileAction,
} from '@/app/actions/users'
import { requireAdmin } from '@/lib/auth'
import { getUserById } from '@/services/users'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, user } = await requireAdmin()
  const profile = await getUserById(supabase, id)
  if (!profile) notFound()

  const updateAction = updateUserProfileAction.bind(null, id)
  const deleteAction = deleteUserProfileAction.bind(null, id)

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/usuarios" className="text-sm text-gray-500 hover:underline">
          ← Volver a usuarios
        </Link>
        <h1 className="text-3xl font-bold mt-2">Editar usuario</h1>
      </div>

      <UserForm
        action={updateAction}
        user={profile}
        showEmail={false}
        submitLabel="Guardar cambios"
      />

      {user.id !== id && (
        <form action={deleteAction}>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Eliminar perfil
          </button>
        </form>
      )}
    </div>
  )
}
