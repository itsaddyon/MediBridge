# MediBridge – Unified Health Referral Platform

Connecting rural healthcare workers, specialist hospitals, and government bodies for seamless, life-saving patient care coordination.

**Capstone Project Brief**: MediBridge solves the critical lack of structured, real-time medical referral communication between under-resourced rural clinics and urban specialist hospitals in India. It is designed for front-line health workers who need to rapidly document patient symptoms and secure hospital beds, and for specialists who need reliable, structured clinical data before the patient arrives. This idea was chosen because disorganized, paper-based referrals frequently lead to preventable delays in emergency medical care.

**Live Frontend Deployment:** [https://medibridgeforindia.vercel.app](https://medibridgeforindia.vercel.app)
**Live Backend API Deployment:** [https://medibridge-e8hz.onrender.com](https://medibridge-e8hz.onrender.com)
**GitHub Repository:** [https://github.com/itsaddyon/MediBridge](https://github.com/itsaddyon/MediBridge)

---

## 🚀 Setup & Run Instructions

To run MediBridge locally, you need Node.js (v18+) and npm installed. The repository contains both the frontend (Vite/React) and the backend (Express/Node.js).

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/itsaddyon/MediBridge.git
cd MediBridge

# Install dependencies and start the dev server
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
npm run build
npm start
```
*Note: Make sure to set your `GEMINI_API_KEY` and Firebase credentials in a `.env` file inside the `server/` directory.*

---

## 🏗️ Architecture Overview

MediBridge uses a modern, scalable architecture designed for low bandwidth environments:

1. **Frontend (React + Vite)**: A highly responsive Progressive Web App built with React, TailwindCSS, and Shadcn UI components. It handles user authentication, offline caching, and intuitive dashboards for Clinics, Doctors, and Admins.
2. **Backend (Node.js + Express)**: A lightweight REST API server deployed on Render. It primarily serves as a secure proxy to interact with external AI providers and handle rate-limiting.
3. **Database (Firebase Firestore)**: A NoSQL cloud database used for real-time syncing of referrals, offline-first data persistence, and secure data storage across devices.
4. **State & Caching (React Query)**: Optimizes network requests, handles data synchronization when connection drops, and maintains the global UI state.

---

## 🤖 AI Integration & Reliability

### How Gemini Fits
MediBridge integrates Google's **Gemini 1.5 Flash** model via the backend API to serve two primary roles:
1. **AI Referral Assistant**: Structures unstructured, messy clinical notes typed by rural health workers into a standardized JSON summary containing `symptoms`, `urgency`, and `missingInfo`.
2. **MediBot Chat Assistant**: A patient-facing chatbot that can locate nearby hospitals and provide general wellness tips.

### The AI Prompts
- **Referral Prompt**: `You are a Medical Documentation Assistant. Your task is to generate a concise, structured referral summary for a doctor. Keep the output as short as possible to save tokens. Do NOT diagnose or prescribe medication.`
- **Reasoning**: We strictly enforce that the AI acts as a *documentation assistant* and not a doctor. Structured JSON outputs ensure the UI renders clinical data cleanly and predictably.

### Failure Handling & Resilience
Gemini is an external dependency, and transient service failures (like `503 Service Unavailable` during high load on the free tier) can occur. MediBridge handles this safely:
- **Bounded Retry**: The backend uses exponential backoff (1s, 2s, max 3 attempts) to retry transient failures with a strict 12-second timeout.
- **Safe Fallback**: If the AI remains unavailable, the backend converts the failure into a controlled application-level error (`AI_SERVICE_UNAVAILABLE`).
- **Non-Blocking Workflow**: The frontend catches this error and gracefully displays: *"AI assistance is temporarily unavailable. You can continue creating the referral manually."* 
- **The Core Rule**: An AI outage NEVER blocks a healthcare worker from submitting a life-saving referral.

---

## ⚡ Performance & Accessibility Audit

MediBridge is designed for rural internet connections. We performed comprehensive audits to ensure it loads fast and is usable by everyone.

- **Lighthouse Score**: Optimized to **≥ 85 (Desktop/Mobile)**.
- **Concrete Improvement Made**: We identified that the interactive Leaflet map (`IndiaMap.tsx`) and the various portal components were causing a large initial Javascript bundle, blocking the main thread. We implemented `React.lazy()` and `<Suspense>` for route-level code splitting and lazy-loading the heavy map, which drastically reduced the Total Blocking Time (TBT) and boosted the mobile performance score.
- **Accessibility**: Passes WAVE/Axe audits with no WCAG AA violations. All buttons use semantic `aria-labels`, contrast ratios meet AA guidelines, and interactive elements are keyboard navigable.

---

## 🛡️ Deployment & Operations

### Deployment Checklist
- [x] Vercel frontend environment variables configured (`VITE_FIREBASE_API_KEY`, `VITE_BACKEND_URL`).
- [x] Render backend environment variables configured (`GEMINI_API_KEY`).
- [x] Production build passes without TypeScript or ESLint errors (`npm run lint` & `npm run build` pass).
- [x] Unit tests and component coverage requirements met (> 50%).
- [x] Secret keys are kept server-side and never exposed to the browser.
- [x] CORS is restricted correctly.

### Safe Failure Modes & Rollback
- **Failure States**: If the backend is down, the frontend relies on Firebase's direct client connection for core referral creation. If Firebase is down, the app caches writes in IndexedDB (Offline mode) until the connection is restored.
- **Rollback Plan**: Vercel and Render both provide instant 1-click rollbacks. If a bad commit breaks production, we immediately redeploy the previous stable build from the main branch.

---

## 🚧 Known Limitations & Future Improvements
1. **Offline Persistence**: While basic caching exists, full background sync service workers for offline media uploads (like X-Rays) are not yet fully implemented.
2. **Static Fallbacks**: The hospital map currently uses a static fallback list of hospitals if the real-time API rate-limits.
3. **Multi-Tenancy**: Firebase security rules are implemented but require stricter validation for a true multi-tenant hospital network.
