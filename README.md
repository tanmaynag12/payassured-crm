# PayAssured CRM

An internal CRM tool for PayAssured to manage clients and track invoice recovery cases.

## Tech Stack

- **Frontend** — Next.js (React)
- **Backend** — FastAPI (Python)
- **Database** — PostgreSQL (Supabase)

## Project Structure

```text
payassured-crm/
├── frontend/
├── backend/
├── db/
├── screenshots/
└── README.md
```

## Setup

### Prerequisites

- Node.js
- Python 3.10+
- A Supabase account (or local PostgreSQL)

### Database

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run the contents of `db/schema.sql`

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=your_supabase_connection_string_here
```

Run the backend:

```bash
uvicorn main:app --reload
```

API will be running at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

App will be running at `http://localhost:3000`

## API Endpoints

### Clients

- `POST /clients` — create a client
- `GET /clients` — list all clients
- `PATCH /clients/{id}` — update client
- `DELETE /clients/{id}` — delete client

### Cases

- `POST /cases` — create a case
- `GET /cases` — list all cases (supports `?status=` and `?order=asc/desc`)
- `GET /cases/{id}` — get one case
- `PATCH /cases/{id}` — update status and notes
- `PATCH /cases/{id}/details` — update invoice details
- `DELETE /cases/{id}` — delete case

## Features

- Dashboard with stats — total clients, cases, pending amount, overdue count
- Case list with filter by status and sort by due date
- Overdue case indicators
- Quick status update from the case list
- Full case detail with edit and notes
- Client management with inline editing
- Light and dark mode
- Indian rupee formatting

## Screenshots

Screenshots are available in the `/screenshots` folder:

- dashboard.png
- cases_list.png
- cases_create.png
- cases_detail.png
- clients_list.png
- client_create.png

## Environment Variables

Example environment files are provided:

- backend/.env.example
- frontend/.env.local.example
