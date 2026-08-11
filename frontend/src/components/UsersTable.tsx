import type { UserDto } from '../dtos/user.dto'
import './UsersTable.css'

interface UsersTableProps {
  users: UserDto[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="table-wrapper">
      <table>
        <caption>Users</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Created at</th>
            <th scope="col">Updated at</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <th scope="row">{user.id}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <time dateTime={user.created_at}>
                  {formatDate(user.created_at)}
                </time>
              </td>
              <td>
                <time dateTime={user.updated_at}>
                  {formatDate(user.updated_at)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
