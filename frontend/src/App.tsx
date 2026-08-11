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
          <div className="user-list">
            {users.map((user) => (
              <article className="user-card" key={user.id}>
                <h2>{user.name}</h2>
                <dl>
                  <div>
                    <dt>ID</dt>
                    <dd>{user.id}</dd>
                  </div>
                  <div>
                    <dt>Name</dt>
                    <dd>{user.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                  </div>
                  <div>
                    <dt>Created at</dt>
                    <dd>{formatDate(user.created_at)}</dd>
                  </div>
                  <div>
                    <dt>Updated at</dt>
                    <dd>{formatDate(user.updated_at)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
