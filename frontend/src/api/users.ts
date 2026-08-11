export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(
  /\/$/,
  '',
)

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`)

  if (!response.ok) {
    throw new Error('Unable to fetch users')
  }

  return response.json() as Promise<User[]>
}
