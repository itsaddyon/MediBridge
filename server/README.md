# medibridge-server

Local backend for Medibridge Connect (Express + Prisma)

Quick start:

1. cd into server and install deps

```powershell
cd server
npm install
```

2. Generate Prisma client and run migrations

```powershell
npm run prisma:generate
npm run prisma:migrate
```

3. Start dev server

```powershell
npm run dev
```

Default DB: SQLite file stored at `server/dev.db`. Change `DATABASE_URL` in `.env` to switch to Postgres.
