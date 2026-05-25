import Link from 'next/link'
import LogoutButton from '@/components/layout/LogoutButton'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Auvit</h2>

      <nav className="flex flex-col gap-4 flex-1">
        <Link href="/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>

        <Link href="/tickets" className="hover:text-gray-300">
          Tickets
        </Link>

        <Link href="/clientes" className="hover:text-gray-300">
          Clientes
        </Link>

        <Link href="/agenda" className="hover:text-gray-300">
          Agenda
        </Link>

        <Link href="/usuarios" className="hover:text-gray-300">
          Usuarios
        </Link>
      </nav>

      <LogoutButton />
    </aside>
  )
}
