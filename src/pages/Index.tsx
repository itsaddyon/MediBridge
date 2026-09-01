import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Building2, Stethoscope, Shield, MapPin, Ambulance, Phone, ArrowRight, CheckCircle2, HeartPulse, UserCheck, FileText, Globe } from "lucide-react";
const IndiaMap = React.lazy(() => import("@/components/IndiaMap"));
import ChatBot from "@/components/ChatBot";
import ThemeToggle from "@/components/ThemeToggle";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- COUNTER HOOK ---
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(target);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// --- STAT COMPONENT ---
function StatCounter({ value, label }: { value: number, label: string }) {
  const count = useCountUp(value);
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/10 backdrop-blur-md">
       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="h-12 w-12 text-cyan-400" />
       </div>
       <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-1">
         {count}+
       </div>
       <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// --- SPLASH SCREEN ---
type SplashOverlayProps = {
  visible: boolean;
  onFinish: (target?: string) => void;
};

function SplashOverlay({ visible, onFinish }: SplashOverlayProps) {
  const [entered, setEntered] = useState(false);
  
  useEffect(() => {
    if (!visible) { setEntered(false); return; }
    const t = setTimeout(() => setEntered(true), 100);
    const finishTimer = setTimeout(() => onFinish(), 3500); 
    return () => { clearTimeout(t); clearTimeout(finishTimer); };
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617] transition-opacity duration-700">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-64 h-64 bg-rose-500/20 rounded-full blur-[100px] animate-pulse"></div>
      </div>
      
      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${entered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <div className="relative mb-8">
           <svg viewBox="0 0 24 24" className="w-32 h-32 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-bounce">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center">
             <Activity className="w-16 h-16 text-white animate-pulse" />
           </div>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight text-white mb-4">MediBridge</h1>
        <p className="text-rose-300 text-lg tracking-widest uppercase font-semibold animate-pulse">System Initializing...</p>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function Index(): JSX.Element {
  const [counts, setCounts] = useState({ patients: 0, active: 0, pending: 0, completed: 0 });
  const [showEmergency, setShowEmergency] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const navigate = useNavigate();
  const mapCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const p = await getCountFromServer(collection(db, "patients"));
        const pen = await getCountFromServer(query(collection(db, "referrals"), where("status", "==", "pending")));
        const act = await getCountFromServer(query(collection(db, "referrals"), where("status", "in", ["accepted", "diagnosed"])));
        const comp = await getCountFromServer(query(collection(db, "referrals"), where("status", "in", ["completed", "closed"])));
        setCounts({ patients: p.data().count, pending: pen.data().count, active: act.data().count, completed: comp.data().count });
      } catch (err) { console.error(err); }
    };
    fetchCounts();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapCardRef.current) return;
    const { left, top, width, height } = mapCardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mapCardRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-rose-500/30 overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-rose-900/10 rounded-full blur-[128px]"></div>
      </div>

      <SplashOverlay visible={splashVisible} onFinish={() => setSplashVisible(false)} />

      {/* 🚨 EMERGENCY MODAL */}
      {showEmergency && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-rose-500/30 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowEmergency(false)} aria-label="Close Emergency Modal" className="absolute top-4 right-4 text-slate-400 hover:text-white"><Activity className="h-6 w-6 rotate-45" /></button>
            <div className="text-center mb-8">
               <div className="h-20 w-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 mx-auto text-rose-500 animate-pulse">
                 <Ambulance className="h-10 w-10" />
               </div>
               <h2 className="text-2xl font-bold text-white">Emergency Assistance</h2>
               <p className="text-slate-400 mt-2">Immediate connection to local services.</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => window.location.href = "tel:112"} className="w-full py-4 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95">
                <Phone className="h-5 w-5" /> Call Ambulance (112)
              </button>
              <button 
  onClick={() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`, "_blank");
      }, () => {
        // Fallback if user denies location access
        window.open("https://www.google.com/maps/search/hospitals+near+me/", "_blank");
      });
    } else {
      window.open("https://www.google.com/maps/search/hospitals+near+me/", "_blank");
    }
  }} 
  className="w-full py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl font-semibold text-white flex items-center justify-center gap-3"
>
  <MapPin className="h-5 w-5 text-cyan-400" /> Locate Hospital
</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 ANIMATING EMERGENCY BUTTON */}
      <button
        onClick={() => setShowEmergency(true)}
        aria-label="Emergency Assistance"
        className={`fixed z-[10000] group flex items-center justify-center rounded-full bg-rose-600/20 border border-rose-500/50 hover:bg-rose-600 hover:border-rose-600 backdrop-blur-md shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all duration-[1500ms] cubic-bezier(0.22, 1, 0.36, 1)
          ${splashVisible 
             ? "bottom-24 left-1/2 -translate-x-1/2 w-auto px-8 py-4 scale-125 opacity-100" 
             : "bottom-6 left-6 translate-x-0 w-14 h-14 px-0 py-0 scale-100 opacity-100"
          }
        `}
      >
        <div className="relative flex items-center justify-center">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
           <Ambulance className="h-6 w-6 text-rose-100 relative z-10" />
        </div>
        <div className={`overflow-hidden transition-all duration-[1500ms] ease-in-out flex items-center ${splashVisible ? "max-w-[200px] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0"}`}>
           <span className="font-bold text-rose-100 whitespace-nowrap text-lg">Emergency Assistance</span>
        </div>
      </button>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-[100]">
        <ThemeToggle className="bg-slate-900/50 backdrop-blur border border-white/10 text-white hover:bg-white/10" />
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 relative">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
                <HeartPulse className="h-4 w-4 animate-pulse" />
                Live Rural Health Network
              </div>

              {/* 💓 HERO TITLE WITH BIG HEART & ECG */}
              <div className="relative inline-block">
                 {/* 1. The Real Heart Shape (Filled) */}
                 <svg className="absolute -top-16 -left-10 w-[140%] h-[220%] text-rose-600/20 z-[-1] pointer-events-none animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                 </svg>

                 {/* 2. The ECG Wave passing THROUGH it */}
                 <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-32 text-rose-400 z-[-1] pointer-events-none opacity-80" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <path d="M0,75 L100,75 L110,40 L120,110 L130,75 L160,75 L170,10 L180,140 L190,75 L250,75 L260,40 L270,110 L280,75 L500,75" 
                          fill="none" stroke="currentColor" strokeWidth="4" 
                          className="animate-[dash_3s_linear_infinite] drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                          strokeDasharray="1000" strokeDashoffset="1000">
                      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="3s" repeatCount="indefinite" />
                    </path>
                 </svg>

                 <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-white leading-[1] drop-shadow-2xl relative z-10">
                   Medi<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Bridge</span>
                 </h1>
              </div>

              <p className="text-2xl text-slate-300 font-light">
                Bridging the Gap in Rural Healthcare
              </p>
              
              <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect remote clinics to city hospitals instantly. 
                Experience seamless referrals, offline-first records, and AI-powered triage.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <button onClick={() => navigate("/clinic-login")} className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2">
                   Get Started <ArrowRight className="h-5 w-5" />
                </button>
                <Link to="/doctor-login" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all flex items-center justify-center">
                   For Doctors
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                 <StatCounter label="Patients" value={counts.patients} />
                 <StatCounter label="Referrals" value={counts.active} />
                 <StatCounter label="Pending" value={counts.pending} />
                 <StatCounter label="Closed" value={counts.completed} />
              </div>
            </div>

            {/* Right Map Card WITH BANNER */}
            <div className="w-full lg:w-[45%]">
               <div className="mb-4 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><MapPin className="h-5 w-5" /></div>
                     <div>
                        <h3 className="font-bold text-white">Where We Operate</h3>
                        <p className="text-xs text-slate-400">Live coverage across states</p>
                     </div>
                  </div>
                  <div className="flex gap-1">
                     <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                     <span className="text-xs text-green-500 font-mono">ONLINE</span>
                  </div>
               </div>

               <div 
                 ref={mapCardRef}
                 onMouseMove={handleMouseMove}
                 onMouseLeave={() => mapCardRef.current && (mapCardRef.current.style.transform = "")}
                 className="relative group transition-transform duration-200 ease-out preserve-3d"
               >
                 <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[400px]">
                    <div className="h-full w-full grayscale-[20%] hover:grayscale-0 transition-all duration-700">
                       <React.Suspense fallback={<div className="h-full w-full flex items-center justify-center text-slate-500">Loading map...</div>}>
                         <IndiaMap />
                       </React.Suspense>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PORTALS SECTION --- */}
      <div className="container mx-auto px-6 py-24 relative z-10">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Select Your Portal</h2>
            <p className="text-slate-400">Secure, role-based access points for every stakeholder</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* CLINIC CARD */}
            <Card className="bg-[#0f172a] border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2">
               <CardHeader className="text-center pb-2">
                  <div className="h-16 w-16 mx-auto bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 text-cyan-400">
                     <Building2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-white text-xl">Clinic Portal</CardTitle>
                  <CardDescription>Rural Health Centers</CardDescription>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-3 mb-6">
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-cyan-500" /> Register Patients Offline</li>
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-cyan-500" /> Create Instant Referrals</li>
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-cyan-500" /> Track Ambulance Status</li>
                  </ul>
                  <Button onClick={() => navigate("/clinic-login")} className="w-full bg-cyan-600 hover:bg-cyan-500">Login to Clinic</Button>
               </CardContent>
            </Card>

            {/* HOSPITAL CARD */}
            <Card className="bg-[#0f172a] border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-2">
               <CardHeader className="text-center pb-2">
                  <div className="h-16 w-16 mx-auto bg-violet-500/10 rounded-2xl flex items-center justify-center mb-4 text-violet-400">
                     <Stethoscope className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-white text-xl">Hospital Portal</CardTitle>
                  <CardDescription>Specialist Doctors</CardDescription>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-3 mb-6">
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-violet-500" /> Review Incoming Cases</li>
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-violet-500" /> Accept/Reject Requests</li>
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-violet-500" /> Update Digital Diagnosis</li>
                  </ul>
                  <Button onClick={() => navigate("/doctor-login")} className="w-full bg-violet-600 hover:bg-violet-500">Login as Doctor</Button>
               </CardContent>
            </Card>

            {/* ADMIN CARD */}
            <Card className="bg-[#0f172a] border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2">
               <CardHeader className="text-center pb-2">
                  <div className="h-16 w-16 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 text-amber-400">
                     <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-white text-xl">Admin Portal</CardTitle>
                  <CardDescription>Government Oversight</CardDescription>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-3 mb-6">
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-amber-500" /> View Analytics Dashboard</li>
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Manage Clinic Access</li>
                     <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Monitor Health Trends</li>
                  </ul>
                  <Button onClick={() => navigate("/admin-login")} className="w-full bg-amber-600 hover:bg-amber-500">Login Admin</Button>
               </CardContent>
            </Card>
         </div>
      </div>

      {/* --- BENEFITS SECTION --- */}
      <div className="container mx-auto px-6 py-12 pb-32 relative z-10 border-t border-white/5">
         <h2 className="text-3xl font-bold text-center mb-12 text-white">Why MediBridge?</h2>
         <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
               <div className="h-10 w-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400 mb-4"><FileText className="h-6 w-6"/></div>
               <h3 className="text-lg font-bold text-white mb-2">Offline EHR</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                  Data is saved locally when internet is down and auto-syncs when online, ensuring no patient record is ever lost.
               </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
               <div className="h-10 w-10 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400 mb-4"><HeartPulse className="h-6 w-6"/></div>
               <h3 className="text-lg font-bold text-white mb-2">Real-time Triage</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                  AI-assisted priority sorting ensures critical patients get attention first, reducing wait times for emergency cases.
               </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
               <div className="h-10 w-10 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 mb-4"><UserCheck className="h-6 w-6"/></div>
               <h3 className="text-lg font-bold text-white mb-2">Secure Access</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                  Role-based authentication guarantees that patient data is only visible to authorized medical personnel.
               </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
               <div className="h-10 w-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 mb-4"><Globe className="h-6 w-6"/></div>
               <h3 className="text-lg font-bold text-white mb-2">National Scale</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                  Built to scale across states, integrating seamlessly with existing government health infrastructure.
               </p>
            </div>
         </div>
      </div>

      <ChatBot />

      {/* --- CENTERED FOOTER --- */}
      <footer className="py-12 border-t border-white/10 bg-[#020617] relative z-10 text-center">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4">
           
           <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/50">
                 <img src="/favicon.ico" alt="Logo" className="h-6 w-6" />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">MediBridge Network</span>
           </div>
           
           <div className="space-y-1">
              <p className="text-slate-500 text-sm">
                 Developed by <span className="text-cyan-400 font-semibold">Team Grey Hats</span>
              </p>
              <p className="text-slate-600 text-xs font-medium">
                 Lead: <span className="text-slate-400">Adarsh Arya</span>
              </p>
           </div>
        </div>
      </footer>
    </div>
  );
}