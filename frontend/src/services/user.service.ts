import type { UserDto } from '../dtos/user.dto'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(
  /\/$/,
  '',
)

export async function getUsers(): Promise<UserDto[]> {
  const response = await fetch(`${API_URL}/users`)

  if (!response.ok) {
    throw new Error('Unable to fetch users')
  }

  return response.json() as Promise<UserDto[]>
}
