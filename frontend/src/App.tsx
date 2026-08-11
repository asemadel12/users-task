import { UsersTable } from './components/UsersTable'
import { useUsers } from './hooks/useUsers'
import './App.css'

function App() {
  const {
    data: users,
    isError,
    isFetching,
    isSuccess,
    refetch,
  } = useUsers()

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

        {isSuccess && users.length > 0 && <UsersTable users={users} />}
      </section>
    </main>
  )
}

export default App
