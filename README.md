# MediBridge Connect

## What it is
MediBridge Connect is a modern, lightweight, production-ready health referral system. The core problem it solves is the difficulty of tracking rural healthcare referrals between clinics, doctors, and hospitals. It connects Rural Clinics (PHC/CHC), District Hospitals, Doctors, and Admin teams through a unified digital platform.

## Who it is for
- **Clinic**: Rural healthcare workers who register patients and create referrals to higher-level facilities.
- **Doctor**: Specialists and hospital doctors who receive referrals, review patient summaries, and update diagnosis statuses.
- **Admin**: Hospital administrators monitoring the network, tracking referral volumes, and managing users.

## Core workflow
1. **Clinic** registers a patient and drafts a referral.
2. The clinic uses the **AI Referral Assistant** to structure observations into a professional summary.
3. The referral is routed to a **Doctor** at a District Hospital.
4. The **Doctor** reviews the structured referral and updates its status (e.g., pending -> diagnosed).
5. The **Admin** maintains oversight of all network activity and referral metrics.

## AI capability
MediBridge includes two distinct AI features powered by Google Gemini:

1. **AI Referral Assistant**: Integrated directly into the referral creation form. It takes rough notes and symptoms from a healthcare worker and structures them into a clear, concise referral summary (Symptoms, Urgency, Missing Info, Suggested Questions). 
   - **Safety Boundary**: The AI is explicitly instructed *not* to diagnose the patient or prescribe medication. It serves strictly as a documentation aide.
   - **Failure Handling**: If the API fails, times out, or returns a malformed response, the user receives a clear UI error message and can manually fill out the referral form. The system remains fully usable without the AI.

2. **Smart MediBot**: A patient-facing chatbot that helps locate nearby clinics/hospitals using browser geolocation and provides general wellness advice.

*Note: API keys are securely managed through a backend proxy (`server/src/routes/gemini.ts`) to prevent client-side exposure.*

## Architecture
The application follows a decoupled client-server architecture:

- **Frontend**: Built with React, TypeScript, Vite, and Tailwind CSS. Hosted statically.
- **API/Server**: An Express.js backend that securely proxies requests to the Google Gemini API.
- **Database**: Firebase Firestore handles patient and referral data, enabling real-time updates and offline resilience.
- **Maps**: Leaflet.js provides interactive network visualization.

## Local setup

To run the project locally, you will need to start both the frontend and the backend server.

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
The following environment variable names must be configured in your `.env` (and `server/.env`) files:

- `VITE_BACKEND_URL`
- `GEMINI_API_KEY`
- (Firebase Config Variables if overriding defaults)

## Testing
The project uses Vitest and React Testing Library to verify critical frontend behavior.

Run the test suite with:
```bash
npm test
```
Tests cover:
- Referral workflow validation and state handling.
- AI Assistant UI states (loading, success, API failures).

## Build
To create a production-ready bundle of the frontend:
```bash
npm run build
```

## Deployment
The frontend is designed to be deployed to static hosting platforms like Vercel or Netlify. The backend (`server` folder) must be deployed to a Node.js compatible environment (e.g., Render, Heroku) and the `VITE_BACKEND_URL` environment variable set accordingly in the frontend deployment.

## Known limitations
- The map currently uses a static fallback list of hospitals if real-time fetching fails.
- Firebase rules are currently open for prototyping; they must be secured before real-world production use.
- The AI Referral Assistant relies on Google's Gemini Flash model, which may occasionally hallucinate if given ambiguous medical acronyms.

## Future improvements
- Implement strict Firebase Security Rules.
- Add an offline-first sync engine using service workers.
- Add multi-language support (Hindi/regional dialects) for the Clinic portal.
