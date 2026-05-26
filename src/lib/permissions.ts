import { USER_ROLES, isUserRole, type UserRole } from '@/types/user'

export { isUserRole }

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  receptionist: 'Recepcionista',
  technician: 'Técnico',
  operations: 'Operaciones',
}

export type AppRoute =
  | '/dashboard'
  | '/tickets'
  | '/clientes'
  | '/agenda'
  | '/usuarios'

/** Add routes and roles here when extending the platform. */
export const ROUTE_PERMISSIONS: Record<AppRoute, readonly UserRole[]> = {
  '/dashboard': USER_ROLES,
  '/tickets': USER_ROLES,
  '/clientes': ['admin', 'receptionist', 'operations'],
  '/agenda': USER_ROLES,
  '/usuarios': ['admin'],
}

export const NAV_ITEMS: { href: AppRoute; label: string }[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/usuarios', label: 'Usuarios' },
]

const PROTECTED_PREFIXES = Object.keys(ROUTE_PERMISSIONS) as AppRoute[]

export function pathnameToAppRoute(pathname: string): AppRoute | null {
  for (const route of PROTECTED_PREFIXES) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return route
    }
  }
  return null
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const appRoute = pathnameToAppRoute(pathname)
  if (!appRoute) return true
  return ROUTE_PERMISSIONS[appRoute].includes(role)
}

export function getNavItemsForRole(role: UserRole) {
  return NAV_ITEMS.filter((item) => ROUTE_PERMISSIONS[item.href].includes(role))
}

export function getDefaultRouteForRole(role: UserRole): AppRoute {
  return getNavItemsForRole(role)[0]?.href ?? '/dashboard'
}
