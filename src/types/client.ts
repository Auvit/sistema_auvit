export type Client = {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  created_at: string
}

export type ClientInput = {
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
}
