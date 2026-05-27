import '@/app/orden-print.css'

export default function OrdenServicioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="orden-servicio-view min-h-screen bg-gray-100">{children}</div>
}
