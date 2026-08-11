# MAKE WORK FLOW Technical Task

A Dockerized monorepo technical task with a React frontend, FastAPI backend, and PostgreSQL database. The frontend fetches database-backed users through the FastAPI API.

## Tech stack

- **Frontend:** React, TypeScript, Vite, TanStack React Query, TanStack Router
- **Backend:** FastAPI, SQLAlchemy 2, Pydantic, psycopg, uv
- **Infrastructure:** PostgreSQL, Docker, Docker Compose, Nginx

## Project structure

```text
.
├── backend/
│   ├── Dockerfile
│   ├── db.py
│   ├── main.py
│   ├── model.py
│   ├── schema.py
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── api/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.ts
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Running the application

The only prerequisite is Docker Desktop or Docker Engine with Docker Compose.

```bash
git clone https://github.com/asemadel12/users-task.git
cd users-task
docker compose up --build
```

No local Node.js, Python, PostgreSQL, manual database creation, migrations, or `.env` file is required for the Docker setup.

## Application URLs

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:8000>
- FastAPI documentation: <http://localhost:8000/docs>
- Health endpoint: <http://localhost:8000/health>
- Users endpoint: <http://localhost:8000/users>

## Usage

1. Open the frontend at <http://localhost:5173>.
2. Click **Fetch Users**.
3. The frontend sends `GET /users` through TanStack React Query.
4. FastAPI queries PostgreSQL using SQLAlchemy.
5. The database-backed users are displayed in a table.

On startup, the backend automatically creates the `users` table and inserts any missing deterministic sample users:

- `Demo User` (`demo@example.com`)
- `Sample User` (`sample@example.com`)

Initialization is idempotent, so normal restarts do not create duplicates or delete existing data.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns the backend health status |
| `GET` | `/users` | Returns all users from PostgreSQL |

## Environment configuration

The root `.env.example` documents the supported configuration:

- `DATABASE_URL`: SQLAlchemy PostgreSQL connection URL
- `FRONTEND_ORIGIN`: origin allowed by backend CORS
- `VITE_API_URL`: browser-facing backend URL used at frontend build time

Docker Compose includes self-contained defaults, so creating a local `.env` file is optional.

## Stopping the application

```bash
docker compose down
```

The PostgreSQL named volume persists data between normal restarts. To remove the containers and persisted database data for a complete reset, run:

```bash
docker compose down -v
```
