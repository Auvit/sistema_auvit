import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_LABELS } from '@/lib/permissions'
import { USER_ROLES } from '@/types/user'

type Props = {
  action: (formData: FormData) => Promise<void>
}

export default function CreateUserForm({ action }: Props) {
  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña temporal *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={6}
          required
          placeholder="Mínimo 6 caracteres"
        />
        <p className="text-xs text-gray-500">
          El usuario podrá iniciar sesión con este email y contraseña. Puede
          cambiarla después en Supabase si lo deseas.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rol *</Label>
        <select
          id="role"
          name="role"
          defaultValue="receptionist"
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">Crear usuario</Button>
    </form>
  )
}
