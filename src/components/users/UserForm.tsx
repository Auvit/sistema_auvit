import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_LABELS } from '@/lib/permissions'
import { USER_ROLES, type UserProfile } from '@/types/user'

type UserFormProps = {
  action: (formData: FormData) => Promise<void>
  submitLabel: string
  user?: UserProfile
  showEmail?: boolean
}

export default function UserForm({
  action,
  submitLabel,
  user,
  showEmail = true,
}: UserFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-lg">
      {showEmail && (
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email ?? ''}
            required
            disabled={!!user}
          />
          {user && (
            <p className="text-xs text-gray-500">
              El email se gestiona desde Supabase Authentication.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" defaultValue={user?.name ?? ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user?.phone ?? ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rol *</Label>
        <select
          id="role"
          name="role"
          defaultValue={user?.role ?? 'receptionist'}
          className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
