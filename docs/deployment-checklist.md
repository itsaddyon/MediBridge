# Deployment Checklist

## Pre-deployment

- [x] Production build passes (`npm run build`)
- [x] Tests pass (`npm test`)
- [x] Environment variables configured (`.env` for frontend, `server/.env` for backend)
- [x] No secrets committed to git
- [x] AI API configured securely in the backend proxy
- [x] Firebase configured
- [x] Error states tested (Auth, AI failure)
- [x] Accessibility checked (Semantic HTML, Focus states)

## Deployment

- [ ] Frontend deployed to a static host (e.g., Vercel, Netlify)
- [ ] Backend deployed to Node environment (e.g., Render, Railway)
- [ ] Live URL verified
- [ ] Critical workflow tested in production (Clinic -> Doctor referral flow)
- [ ] AI workflow tested in production

## Post-deployment

- [ ] Referral creation works
- [ ] Referral update works
- [ ] AI assistant works
- [ ] Failure states work
- [ ] Authentication works

## Rollback
If the deployment fails, the rollback mechanism is to redeploy the previous successful Git commit using your hosting provider's dashboard (e.g., "Redeploy" in Vercel or Render).
