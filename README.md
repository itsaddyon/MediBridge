# 🌉 MediBridge Connect  
### Unified Health Referral & Rural Outreach Platform  

MediBridge Connect is a modern, lightweight, production-ready health referral system designed to connect **Rural Clinics (PHC/CHC), District Hospitals, Doctors, and Admin teams** through a unified digital platform.

The platform supports real-time referral tracking, patient registration, analytics, nearby clinic lookup via chatbot, and role-based dashboards.

---

## 🚀 Features

### 👨‍⚕️ Multi-Portal System
- **Clinic Portal** – Register patients, create referrals, track statuses  
- **Doctor Portal** – View assigned referrals, update diagnosis, manage status  
- **Admin Portal** – Hospital monitoring, user management, activity logs  

---

## 🧭 Smart MediBot (Chat Assistant)
A built-in chatbot that:
- Greets users with a friendly avatar  
- Locates **nearby clinics/hospitals** using browser geolocation  
- Suggests shortcuts like  
  - “Find clinics near me”  
  - “Locate hospitals nearby”  
  - “Show nearest PHC”  
- Opens Google Maps with directions  
- Works fully client-side  

---

## 🗺 Interactive Map System  
Powered by **Leaflet.js**, featuring:
- Live clinic/hospital markers  
- Filters (PHC, Lab, Pharmacy, Ambulance)  
- Smooth and lightweight zoom/pan  
- Great for rural health network visualization  

---

## 📊 Dashboards  
Each portal includes custom dashboards such as:
- **Total Patients**
- **Active Referrals**
- **Completed Referrals**
- **Pending Diagnoses**
- Recent referral history
- Activity logs (for Admin)

---

## 🧾 Patient & Referral Management  
- Add/edit patient records  
- Create digital referrals  
- Auto-updates all dashboard counters  
- Stored securely in browser LocalStorage (prototype mode)  
- Ready for migration to cloud/DB backend

---

## 🎨 Beautiful UI & UX  
- Tailwind CSS  
- Animated login screens  
- Floating icons (medical-themed)  
- Dark/light adaptive theming  
- Neon hover glow on feature cards  
- Responsive layouts for all screen sizes  

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|------------|
| Language | **TypeScript** |
| Framework | **React.js** |
| UI Framework | **Tailwind CSS** |
| Build Tool | **Vite** |
| Routing | React Router |
| Maps | Leaflet.js + Google Maps |
| Storage (prototype) | FireBase |
| Chatbot | Google Gemini-flash + Geolocation API + React |

---




---

##🧪 **Data Storage** (Prototype Mode)

MediBridge uses FireBase for storing:

Patients

Referrals

Session states

This allows:

Offline functionality

No backend required


##🔮 **Future Enhancements**

Backend API (Node / Firebase / Supabase / Django)

Encrypted patient record storage

Multi-language support (Hindi/regional dialects)

Offline sync engine

Automatic referral routing logic

Health worker mobile app (React Native)

##🤝 **Contributors**

**Adarsh Arya** (itsaddyon) & Team Grey Hats

MedTech Category

Built with love, purpose, and clean code.
