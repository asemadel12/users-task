import { useQuery } from '@tanstack/react-query'

import { fetchUsers } from './api/users'
import './App.css'

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function App() {
  const {
    data: users,
    isError,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: false,
  })

  return (
    <main className="app">
      <header>
        <p className="eyebrow">MAKE WORK FLOW</p>
        <h1>Users</h1>
        <p className="intro">Fetch the current users from the backend API.</p>
      </header>

      <button
        type="button"
        disabled={isFetching}
        onClick={() => void refetch()}
      >
        {isFetching ? 'Fetching Users…' : 'Fetch Users'}
      </button>

      <section className="results" aria-live="polite">
        {isFetching && <p className="status">Loading users…</p>}

        {isError && (
          <p className="error" role="alert">
            We could not fetch users. Please try again.
          </p>
        )}

        {isSuccess && users.length === 0 && (
          <p className="status">No users found.</p>
        )}

        {isSuccess && users.length > 0 && (
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
        )}
      </section>
    </main>
  )
}

export default App
