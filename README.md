# Mini Kanban Board

A production-ready Mini Kanban Board with real-time collaboration using **NestJS** (backend), **Next.js** (frontend), **PostgreSQL + Prisma**, and **WebSocket** for live updates.

## Architecture

- **Frontend**: Next.js 14+ App Router, React, Tailwind CSS, `@dnd-kit` for drag-and-drop, Socket.io-client.
- **Backend**: NestJS, Prisma ORM, PostgreSQL, JWT Authentication, Socket.io via `@nestjs/websockets`.

## Prerequisites

- Node.js v20+
- PostgreSQL database

## Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database.
2. In the root directory, copy the `.env.example` to `.env` (or create one):
   ```bash
   cp .env.example .env
   ```
3. Update `DATABASE_URL` with your PostgreSQL connection string in both the root `.env` and `backend/.env`.

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations:
   ```bash
   npx prisma db push
   ```
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   The backend API runs on `http://localhost:3001`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend app runs on `http://localhost:3000`.

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Boards
- `GET /api/boards` - Get all boards for current user
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get specific board with columns and tasks
- `PATCH /api/boards/:id` - Update board title
- `DELETE /api/boards/:id` - Delete board

### Columns
- `POST /api/boards/:boardId/columns` - Add a column
- `PATCH /api/columns/:id` - Update a column
- `DELETE /api/columns/:id` - Delete a column

### Tasks
- `POST /api/columns/:columnId/tasks` - Add a task
- `PATCH /api/tasks/:id` - Update task details
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/move` - Move task between columns or reorder (fractional indexing)

### Board Sharing
- `POST /api/boards/:id/members` - Add a member to the board
- `GET /api/boards/:id/members` - List board members
- `DELETE /api/boards/:id/members/:userId` - Remove member

## Testing

### Backend
```bash
cd backend
npm run test       # Unit tests
npm run test:e2e   # E2E tests
```

### Frontend
```bash
cd frontend
npm run test       # Component and Integration tests
npx playwright test # E2E tests
```
