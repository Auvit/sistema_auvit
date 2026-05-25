import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">
        Auvit
      </h2>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/tickets">
          Tickets
        </Link>

        <Link href="/clientes">
          Clientes
        </Link>

        <Link href="/agenda">
          Agenda
        </Link>

        <Link href="/usuarios">
          Usuarios
        </Link>
      </nav>
    </aside>
  )
}