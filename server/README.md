# 🌉 MediBridge Connect
### Unified Health Referral & Rural Outreach Platform

![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Firebase%20%7C%20Tailwind-orange?style=for-the-badge)

**MediBridge Connect** is a modern, lightweight health referral system designed to connect **Rural Clinics (PHC/CHC), District Hospitals, Doctors, and Admin teams** through a unified digital platform.

The platform supports real-time referral tracking, patient registration, and analytics, and features an AI-powered emergency assistant.

---

## 🚀 Key Updates (v2.0)
* **backend Integration:** Migrated from LocalStorage to **Firebase & Firestore** for real-time data syncing.
* **Glassmorphic UI:** Complete visual overhaul with modern glass-effect components and dark mode support.
* **Enhanced Chatbot:** Now features structured responses (Calm Advice + Hospital Table) and auto-geolocation.
* **Interactive Animations:** Includes a Heartbeat Splash Screen and pulsing ECG title effects.

---

## 🌟 Features

### 👨‍⚕️ Multi-Portal System
* **Clinic Portal:** Register patients, create digital referrals, and track acceptance status in real-time.
* **Doctor Portal:** View assigned referrals, update diagnoses, and manage patient discharge status.
* **Admin Portal:** Monitor hospital network activity, user management, and view system-wide logs.

### 🧭 Smart MediBot (AI Assistant)
A redesigned, mobile-responsive chatbot featuring:
* **Glassmorphic Interface:** A modern, translucent UI.
* **Intelligent Response:** Provides "Calm Advice" first, followed by a structured HTML table of nearby resources.
* **Auto-Location:** Uses browser geolocation to instantly find nearby PHCs and Hospitals.
* **Direct Navigation:** One-click Google Maps integration.

### 🚨 Emergency Access
* **Floating Action Button:** A dedicated emergency button (bottom-left) with animated collapse/expand physics.
* **Quick Connect:** Instant access to ambulance and emergency services logic.

### 🗺 Interactive Map System
Powered by **Leaflet.js**:
* Live clinic/hospital markers with status indicators.
* Filters for PHC, Lab, Pharmacy, and Ambulance.
* Optimized for low-bandwidth rural networks.

---

## 📊 Dashboards & Analytics
Each portal includes role-specific dashboards:
* **Real-time Counters:** Total Patients, Active Referrals, Pending Diagnoses.
* **Visual History:** Recent referral logs and status updates.
* **Admin Logs:** Comprehensive activity tracking for audit purposes.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js (Vite), TypeScript |
| **Styling** | Tailwind CSS (Glassmorphism), Framer Motion |
| **Backend** | Firebase / Firestore |
| **Maps** | Leaflet.js |
| **Chatbot** | React + Geolocation API + Custom Logic |
| **Routing** | React Router DOM |

---

## 📸 Usage & UI

The interface features a **Heartbeat Splash Screen** upon loading, followed by a dashboard with **Neon Hover Effects** and medical-themed floating icons. The "MediBridge" title features a continuous **ECG Pulse animation**.

---

## 🛠 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/itsaddyon/medibridge-connect.git](https://github.com/itsaddyon/medibridge-connect.git)
    cd medibridge-connect
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    * Create a `.env` file in the root directory.
    * Add your Firebase config keys:
        ```env
        VITE_FIREBASE_API_KEY=your_key
        VITE_FIREBASE_AUTH_DOMAIN=your_domain
        VITE_FIREBASE_PROJECT_ID=your_id
        ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## 🔮 Future Roadmap
* [ ] Multi-language support (Hindi/Regional dialects)
* [ ] Offline sync engine (PWA capability)
* [ ] Automatic referral routing logic based on hospital capacity
* [ ] Health worker mobile app (React Native)

---

## 🤝 Contributors

**Team Grey Hats**
* **Adarsh Arya** (Lead Developer)
* Team Members

*Built with love, purpose, and clean code.*