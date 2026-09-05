# Final Deployment Implementation Plan

Based on your decisions and our codebase analysis, here is the concrete implementation plan to prepare the Mini Kanban Board for deployment using **Vercel** (Frontend) and **Render + UptimeRobot** (Backend).

## Selected Architecture
- **Frontend**: Vercel
- **Backend**: Render Web Service
- **Keep-Alive Strategy**: UptimeRobot hitting a health check endpoint to prevent Render's 15-minute sleep.
- **Database**: Neon (PostgreSQL)

## Required Environment Variables (For your Dashboards)

**Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL`: Set to your Render URL (e.g., `https://my-backend.onrender.com`)

**Render (Backend):**
- `DATABASE_URL`: Your Neon Postgres connection string
- `FRONTEND_URL`: Your Vercel frontend URL (for CORS)
- `JWT_SECRET`: Your production secret
- `JWT_REFRESH_SECRET`: Your production refresh secret
- *(Note: Render will automatically set the `PORT` variable)*

---

## Proposed Codebase Changes

### 1. General Workspace
#### [NEW] `vercel.json` (Root)
Create a config file in the root to instruct Vercel to only build the `frontend` folder for this monorepo.
```json
{
  "framework": "nextjs",
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev"
}
```

#### [NEW] `render.yaml` (Root)
Create Render's Blueprint file in the root so Render knows how to deploy the backend automatically.
```yaml
services:
  - type: web
    name: mini-kanban-backend
    env: node
    rootDir: backend
    buildCommand: npm install && npx prisma db push && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_VERSION
        value: 20
      - key: PORT
        value: 10000
```
*(We include `npx prisma db push` in the build command to ensure the Neon database schema is up-to-date on deployment.)*

### 2. Backend (`/backend`)

#### [MODIFY] `backend/src/main.ts`
Update the port binding logic to respect Render's `PORT` variable and explicitly bind to `0.0.0.0` for Docker/cloud environments.
```typescript
  // Change:
  const port = process.env.BACKEND_PORT ?? 5000;
  await app.listen(port);
  // To:
  const port = process.env.PORT || process.env.BACKEND_PORT || 5000;
  await app.listen(port, '0.0.0.0');
```

#### [MODIFY] `backend/src/app.controller.ts`
Add a dedicated health check endpoint for UptimeRobot.
```typescript
  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
```

### 3. Frontend (`/frontend`)
*No React code changes required.* The `api.ts` and WebSocket initialization already properly read `process.env.NEXT_PUBLIC_API_URL`.

---

## Verification Plan

1. **Locally apply changes**: Create the config files and update the backend files.
2. **Build check**: Run a test build to ensure no TypeScript/Lint errors prevent deployment.
3. **Execution**: Once approved, I will implement these files immediately. You can then connect the GitHub repo to Vercel and Render!
