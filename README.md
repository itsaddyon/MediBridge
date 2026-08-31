# MediBridge

## What it is
MediBridge is a capstone project representing a lightweight, production-ready health referral system. It is designed to connect Rural Clinics (PHC/CHC), District Hospitals, and Admin teams through a unified digital platform. The core goal is to demonstrate a functional, accessible, and AI-enhanced referral workflow.

## Who it is for
- **Clinic**: Rural healthcare workers who register patients and create referrals to higher-level facilities.
- **Doctor**: Specialists and hospital doctors who receive referrals, review patient summaries, and update diagnosis statuses.
- **Admin**: Hospital administrators monitoring the network and tracking referral volumes.

## Core workflow
1. **Clinic** registers a patient and drafts a referral.
2. The clinic uses the **AI Referral Assistant** to structure observations into a professional summary.
3. The referral is routed to a **Doctor** at a District Hospital.
4. The **Doctor** reviews the structured referral and updates its status.
5. The **Admin** maintains oversight of network activity.

## AI capability
MediBridge includes two distinct AI features powered by Google Gemini:

1. **AI Referral Assistant**: Integrated directly into the referral creation form. It takes rough notes and symptoms from a healthcare worker and structures them into a clear, concise JSON summary (Symptoms, Urgency, Missing Info, Suggested Questions) which is then parsed into the UI.
   - **Safety Boundary**: The AI is explicitly instructed *not* to diagnose the patient or prescribe medication. It serves strictly as a documentation aide.
   - **Failure Handling**: If the API fails or returns a malformed response, the user receives a clear UI error message and can manually fill out the referral form. 

2. **Smart MediBot**: A patient-facing chatbot that helps locate nearby clinics/hospitals and provides general wellness advice. It will refuse to diagnose medical conditions and uses an HTML table for displaying location results.

*Note: API keys are securely managed through a backend proxy (`server/src/routes/gemini.ts`) to prevent client-side exposure.*

## Architecture
- **Frontend**: Built with React, TypeScript, Vite, and Tailwind CSS.
- **Backend API**: An Express.js backend that securely proxies requests to the Google Gemini API.
- **Database**: Firebase Firestore handles patient and referral data, with basic Role-Based Access Control (RBAC) via `firestore.rules`.

## Local setup

1. Install all dependencies:
   ```bash
   npm install
   npm run server:install
   ```

2. Start the development servers (frontend and backend concurrently):
   ```bash
   npm run dev
   npm run server:dev
   ```

The frontend will be available at `http://localhost:8080`, and the backend at `http://localhost:4000`.

## Environment variables
Configure the following in your `.env` (frontend) and `server/.env` (backend) files:
- `VITE_BACKEND_URL`
- `GEMINI_API_KEY` (in `server/.env`)

## Testing
The project uses Vitest and React Testing Library to verify frontend behavior with >= 50% component test coverage.

Run the test suite with:
```bash
npm run test:coverage
```

## Build & Deployment
To create a production-ready bundle of the frontend:
```bash
npm run build
```
- **Frontend Live Deployment**: [https://medibridgeforindia.vercel.app](https://medibridgeforindia.vercel.app) (Hosted on Vercel)
- **Backend Deployment**: Needs to be deployed to a Node.js compatible environment (e.g., Render) and the `VITE_BACKEND_URL` updated.

## Performance & Accessibility
- Lighthouse performance is optimized to be ≥ 85.
- The UI follows WCAG AA guidelines with appropriate `aria-labels` on buttons, semantic HTML, and high contrast themes.

## Known limitations
- The map currently uses a static fallback list of hospitals if real-time fetching fails.
- Firebase rules are implemented but are basic and may need refinement for a real-world multi-tenant system.
- Offline-first capabilities are not fully implemented.

## Future improvements
- Add comprehensive offline caching via service workers.
- Add multi-language support (Hindi/regional dialects) for the Clinic portal.
- Expand end-to-end (E2E) testing coverage.
