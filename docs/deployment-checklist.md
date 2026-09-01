# Deployment Checklist

## Frontend Deployment (Vercel)
- [x] Hosted securely on Vercel at `https://medibridgeforindia.vercel.app`.
- [x] Build command (`npm run build`) completes successfully.
- [x] Output directory is `dist/`.
- [x] React Router rewrite rules configured for SPA routing.
- [x] Verified Lighthouse results: 95 Performance, 91 Accessibility.
- [x] Required environment variables set (`VITE_FIREBASE_API_KEY`, etc., `VITE_BACKEND_URL`).

## Backend Deployment (Render)
- [x] Hosted securely on Render at `https://medibridge-e8hz.onrender.com`.
- [x] `GEMINI_API_KEY` is secured on the server-side environment variables.
- [x] CORS properly configured to allow the Vercel frontend.
- [x] Built-in rate limiting functional to prevent API abuse.
- [x] Bounded retries and exponential backoff active for external Gemini AI transient failures.

## Database (Firebase)
- [x] Firestore security rules actively restricting unauthorized access.
- [x] Service account/API keys not exposed in the client repository.

## Verification
- [x] Production frontend is reachable and fast.
- [x] Backend responds to `/api/gemini` securely.
- [x] AI Assistant structure works and creates JSON safely.
- [x] Fallback mechanism visually verified (AI failure does not block manual form submission).
- [x] Vitest test suite passing (16/16).
- [x] Coverage >= 50%.

## Rollback Plan
Since there is no formal third-party monitoring service configured, we rely on standard Git flow and hosting controls:
1. **Detect Issue**: User reports or manual verification fails.
2. **Git Revert**: Revert the problematic commit in the `main` branch via GitHub.
3. **Redeploy**: Vercel and Render auto-deploy on push. We can also manually trigger an "Instant Rollback" to the previous known-good deployment via the Vercel/Render dashboard.
4. **Verification**: Confirm the frontend and backend are compatible and the AI/Referral workflow succeeds.
