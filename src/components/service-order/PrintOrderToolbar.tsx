'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  ticketId: string
}

export default function PrintOrderToolbar({ ticketId }: Props) {
  return (
    <div className="no-print sticky top-0 z-10 bg-gray-100 border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        Vista previa de orden de servicio — usa Imprimir o Guardar como PDF
      </p>
      <div className="flex gap-2">
        <Link
          href={`/tickets/${ticketId}`}
          className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex')}
        >
          Volver al ticket
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className={cn(buttonVariants(), 'inline-flex')}
        >
          Imprimir
        </button>
      </div>
    </div>
  )
}
