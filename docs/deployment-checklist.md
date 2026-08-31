# Deployment Checklist

This document ensures that MediBridge is ready for production deployment, adhering to the final Capstone requirements.

## Frontend (Vercel)
- [x] **Environment Variables**: Ensure `VITE_BACKEND_URL` is set to the production backend URL (e.g., on Render or Heroku).
- [x] **Build Script**: Ensure the build command is `npm run build` and output directory is `dist`.
- [x] **Routing**: Ensure a `vercel.json` or equivalent redirect rule exists to redirect all requests to `index.html` (React Router).
- [x] **Performance**: Verify Lighthouse score is ≥ 85 in production.

## Backend (Render/Heroku/Railway)
- [x] **Environment Variables**:
  - `GEMINI_API_KEY`: Must be valid and strictly kept on the server.
  - CORS settings: Ensure the frontend URL is allowed.
- [x] **Start Command**: `npm start` (which should run `node index.js`).
- [x] **Rate Limiting**: Configured in `server/src/routes/gemini.ts` to prevent API abuse.

## Firebase Configuration
- [x] **Firestore Rules**: Ensure `firestore.rules` are deployed. Basic RBAC is currently implemented; further refinement needed for multi-tenant scalability.
- [x] **Authentication**: Firebase Authentication methods (e.g., Email/Password or Google) are enabled if required.
- [x] **Indexes**: Ensure any composite indexes required by Firestore queries are built.

## Verification
- [x] AI Assistant parses responses as strict JSON.
- [x] AI Assistant refuses to diagnose or prescribe.
- [x] MediBot limits responses strictly to the scoped health queries and emergency contacts.
- [x] Unit tests pass locally with ≥ 50% component coverage (`npm run test:coverage`).
