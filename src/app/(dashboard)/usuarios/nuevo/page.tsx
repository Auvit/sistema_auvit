import Link from 'next/link'
import UserForm from '@/components/users/UserForm'
import { createUserProfileAction } from '@/app/actions/users'
import { requireAdmin } from '@/lib/auth'

export default async function NuevoUsuarioPage() {
  await requireAdmin()

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/usuarios" className="text-sm text-gray-500 hover:underline">
          ← Volver a usuarios
        </Link>
        <h1 className="text-3xl font-bold mt-2">Agregar usuario</h1>
        <p className="text-sm text-gray-500 mt-1">
          Primero crea el usuario en Supabase Authentication (o invítalo) y
          luego asígnale rol aquí por email.
        </p>
      </div>

      <UserForm action={createUserProfileAction} submitLabel="Guardar usuario" />
    </div>
  )
}
