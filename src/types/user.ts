export const USER_ROLES = [
  'admin',
  'receptionist',
  'technician',
  'operations',
] as const

export type UserRole = (typeof USER_ROLES)[number]

export type UserProfile = {
  id: string
  name: string | null
  email: string
  role: UserRole
  phone: string | null
  created_at: string
}

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value)
}
