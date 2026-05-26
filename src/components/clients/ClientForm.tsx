import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Client } from '@/types/client'

type ClientFormProps = {
  action: (formData: FormData) => Promise<void>
  client?: Client
  submitLabel: string
}

export default function ClientForm({
  action,
  client,
  submitLabel,
}: ClientFormProps) {
  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={client?.name ?? ''}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={client?.phone ?? ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={client?.email ?? ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          defaultValue={client?.address ?? ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Input id="notes" name="notes" defaultValue={client?.notes ?? ''} />
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
