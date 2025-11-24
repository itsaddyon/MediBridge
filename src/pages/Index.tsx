import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Building2, Stethoscope, Shield } from "lucide-react";
import IndiaMap from "@/components/IndiaMap";
import ChatBot from "@/components/ChatBot";

const stats = [
  { label: "Clinics connected", value: 87 },
  { label: "Referrals processed", value: 3456 },
  { label: "Patients served", value: 1248 },
  { label: "Active hospitals", value: 42 },
];

function useCountUp(target: number, duration = 900) {
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

type SplashOverlayProps = {
  visible: boolean;
  onFinish: (target?: string) => void;
  title?: string;
  tagline?: string;
  duration?: number;
  target?: string;
};

function SplashOverlay({
  visible,
  onFinish,
  title = "MediBridge",
  tagline = "Unified Health Referral & Rural Outreach",
  duration = 2800,
  target,
}: SplashOverlayProps) {
  useEffect(() => {
    if (!visible) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      const t = setTimeout(() => onFinish(target), 150);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => onFinish(target), duration);
    return () => clearTimeout(t);
  }, [visible, onFinish, duration, target]);

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!visible) {
      setEntered(false);
      return;
    }
    const t = setTimeout(() => setEntered(true), 70);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden={visible ? "false" : "true"}
      className="fixed inset-0 flex items-center justify-center splash-overlay"
      style={{
        zIndex: 9999,
        pointerEvents: "auto",
        background: "linear-gradient(180deg, rgba(3,7,18,0.9), rgba(2,6,22,0.95))",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className={`intro-item heart-wrap ${entered ? "intro-visible" : ""}`}
        style={{ ["--delay" as any]: "60ms" }}
        aria-hidden
      >
        <svg
          viewBox="0 0 64 64"
          className="splash-heart-svg"
          aria-hidden
          style={{ width: 260, height: 260, filter: "blur(8px)", opacity: 0.32, transformOrigin: "center center" }}
        >
          <defs>
            <linearGradient id="heartGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ff7a7a" />
              <stop offset="1" stopColor="#ff3d4d" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feBlend in="SourceGraphic" in2="b" mode="screen" />
            </filter>
          </defs>

          <g filter="url(#softGlow)">
            <path
              d="M32 52s-18-10.5-24-16C2.5 29 8 17 18 17c6 0 9.5 5 14 10 4.5-5 8-10 14-10 10 0 15.5 12 10 19-6 6-24 16-24 16z"
              fill="url(#heartGrad)"
              className="splash-heart-path"
            />
          </g>
        </svg>
      </div>

      <div className="relative z-10 text-center px-6">
        <div
          className={`intro-item logo-box ${entered ? "intro-visible" : ""}`}
          style={{ ["--delay" as any]: "180ms" }}
          aria-hidden
        >
          <div
            className="mx-auto rounded-3xl flex items-center justify-center"
            style={{
              width: 110,
              height: 110,
              background: "linear-gradient(160deg,#23e6cf,#19d4bf)",
              boxShadow: "0 12px 40px rgba(2,6,23,0.5)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="/favicon.ico" alt="MediBridge logo" style={{ width: 80, height: 80, objectFit: "contain" }} />
          </div>
        </div>

        <div
          className={`intro-item splash-title-wrap ${entered ? "intro-visible" : ""}`}
          style={{ ["--delay" as any]: "320ms" }}
        >
          <h1 className="mt-6 text-3xl font-extrabold text-white">{title}</h1>
        </div>

        <div
          className={`intro-item splash-tagline-wrap ${entered ? "intro-visible" : ""}`}
          style={{ ["--delay" as any]: "440ms" }}
        >
          <p className="mt-2 text-sm text-slate-200 opacity-90">{tagline}</p>
        </div>
      </div>

      <style>{`
        :root { --intro-ease: cubic-bezier(.2,.9,.3,1); }

        /* center the heart behind the logo */
        .heart-wrap { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); z-index: 8; }

        /* use a centered scale-in for the intro items so the splash appears in the viewport center */
        .intro-item {
          opacity: 0;
          transform: scale(0.92);
          transition: transform 420ms var(--intro-ease), opacity 360ms ease;
          will-change: transform, opacity;
        }
        .intro-item.intro-visible {
          opacity: 1;
          transform: scale(1);
        }

        /* allow per-item stagger via CSS variable */
        .intro-item { transition-delay: var(--delay, 0ms); }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .intro-item { transition: none !important; transform: none !important; opacity: 1 !important; }
        }

        /* keep existing heart pulse animations intact */
        @keyframes heart-beat {
          0% { transform: scale(0.94); opacity: 0.32; }
          30% { transform: scale(1.08); opacity: 0.6; }
          60% { transform: scale(0.98); opacity: 0.46; }
          100% { transform: scale(0.94); opacity: 0.32; }
        }
        @keyframes heart-ring {
          0% { transform: scale(0.9); opacity: 0.18; }
          50% { transform: scale(1.4); opacity: 0.06; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        .splash-heart-svg { animation: heart-beat 1.2s ease-in-out infinite; transform-origin: center center; }
        .splash-heart-path { animation: heart-ring 1.8s ease-out infinite; transform-origin: center center; }

        @media (prefers-reduced-motion: reduce) {
          .splash-heart-svg, .splash-heart-path { animation: none !important; opacity: 0.26 !important; }
        }
      `}</style>
    </div>
  );
}

export default function Index(): JSX.Element {
  const counts = stats.map((s) => useCountUp(s.value));
  const [splashVisible, setSplashVisible] = useState<boolean>(true);
  const [splashTarget, setSplashTarget] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const mapCardRef = useRef<HTMLDivElement | null>(null);
  const mapInnerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const card = mapCardRef.current;
    const inner = mapInnerRef.current;
    if (!card || !inner) return;

    let bounds = card.getBoundingClientRect();
    const calcBounds = () => (bounds = card.getBoundingClientRect());
    window.addEventListener("resize", calcBounds);
    function onPointerMove(e: PointerEvent) {
      const x = (e.clientX - bounds.left) / bounds.width - 0.5;
      const y = (e.clientY - bounds.top) / bounds.height - 0.5;
      const rx = -y * 6;
      const ry = x * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      inner.style.transform = `translateZ(30px) translateX(${x * 8}px) translateY(${y * 6}px) scale(1.01)`;
    }
    function onLeave() {
      card.style.transform = "";
      inner.style.transform = "";
    }
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", calcBounds);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  function showSplashAndNavigate(target: string) {
    setSplashTarget(target);
    setSplashVisible(true);
  }

  function finishSplash(target?: string) {
    setSplashVisible(false);
    if (target) {
      setTimeout(() => navigate(target), 60);
    }
  }

  function handleCTAClick(e: React.MouseEvent<HTMLButtonElement>, target: string) {
    const btn = e.currentTarget;
    btn.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], {
      duration: 420,
      easing: "ease-out",
    });
    const burst = document.createElement("span");
    burst.style.position = "absolute";
    burst.style.width = "10px";
    burst.style.height = "10px";
    burst.style.borderRadius = "50%";
    burst.style.left = "50%";
    burst.style.top = "50%";
    burst.style.transform = "translate(-50%,-50%)";
    burst.style.background = "radial-gradient(circle, #fff, #19d4bf)";
    burst.style.opacity = "0.95";
    burst.style.pointerEvents = "none";
    btn.appendChild(burst);
    setTimeout(() => burst.remove(), 420);

    showSplashAndNavigate(target);
  }

  const handleMapCardClick = () => {
    if (!mapLoaded) {
      setMapLoaded(true);
      const inner = mapInnerRef.current;
      if (!inner) return;
      const info = document.createElement("div");
      info.style.position = "absolute";
      info.style.left = "12px";
      info.style.bottom = "12px";
      info.style.background = "rgba(0,0,0,0.55)";
      info.style.padding = "8px 10px";
      info.style.borderRadius = "8px";
      info.style.color = "#fff";
      info.textContent = "Map initialized (demo)";
      inner.appendChild(info);
      setTimeout(() => info.remove(), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800 text-slate-50">
      {/* Splash overlay */}
      <SplashOverlay visible={splashVisible} onFinish={finishSplash} target={splashTarget} />

      {/* animated background blobs — just beneath splash */}
      <div aria-hidden style={{ zIndex: 9900, position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0), rgba(255,255,255,0.02))",
            animation: "drift 12s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(30px)",
            opacity: 0.12,
            width: 320,
            height: 320,
            right: "14%",
            bottom: "18%",
            background: "linear-gradient(180deg,#5a4bff,#6e56ff)",
            animation: "floaty 8s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
        <div
          style={{
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(30px)",
            opacity: 0.14,
            width: 260,
            height: 260,
            left: "6%",
            bottom: "6%",
            background: "linear-gradient(180deg,#19d4bf,#0bd9c6)",
            animation: "floaty 8s ease-in-out infinite",
          }}
        />
      </div>

      <header className="container mx-auto px-6 pt-16 lg:pt-24 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <img src="/favicon.ico" alt="MediBridge logo" className="h-14 w-14 rounded-lg shadow-md border border-white/10" />
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">MediBridge</h1>
                <p className="mt-1 text-sm text-slate-300">Unified Health Referral & Rural Outreach</p>
              </div>
            </div>

            <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">
              Connect rural clinics, hospitals and government health teams for faster, safer patient care.
              Create referrals, track status in real time, and monitor community health trends.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
              <button
                onClick={(e) => handleCTAClick(e as any, "/clinic-login")}
                className="relative overflow-visible bg-teal-400 text-slate-900 px-6 py-2 font-semibold shadow-lg hover:bg-teal-300 rounded-md"
                aria-label="Get started — Clinic"
              >
                Get started — Clinic
              </button>

              <div className="flex items-center gap-3">
                <Link to="/clinic-login" className="text-sm text-slate-300 underline">Register a patient</Link>
                <Link to="/doctor-login" className="text-sm text-slate-300 underline">See referrals</Link>
              </div>
            </div>

            {/* impact stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto lg:mx-0">
              {stats.map((s, i) => (
                <div key={s.label} className="bg-white/4 px-4 py-3 rounded-lg backdrop-blur border border-white/6 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="text-2xl font-bold text-white">{counts[i]}</div>
                  <div className="text-xs text-slate-300 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel / map with tilt effect */}
          <div className="w-full lg:w-1/2">
            <Card className="shadow-2xl border border-white/6 bg-gradient-to-br from-white/3 to-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Where we operate</CardTitle>
                <CardDescription>Interactive clinics & hospitals map (click markers)</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={mapCardRef}
                  onClick={handleMapCardClick}
                  className="map-card relative rounded-md overflow-hidden"
                  style={{
                    minHeight: 320,
                    transition: "transform .18s ease, box-shadow .18s ease",
                    zIndex: 10, // keep the card above page content but below splash
                  }}
                >
                  <div
                    ref={mapInnerRef}
                    className="map-inner rounded-md overflow-hidden"
                    style={{
                      height: "100%",
                      transition: "transform .25s ease",
                      background: "transparent",
                    }}
                  >
                    {/* IndiaMap (leaflet) */}
                    <div style={{ minHeight: 320 }}>
                      <IndiaMap />
                    </div>

                    {/* small overlay elements in the map card */}
                    <div style={{ position: "absolute", left: 16, top: 16, background: "rgba(255,255,255,0.95)", color: "#042", padding: "10px 14px", borderRadius: 12, boxShadow: "0 8px 30px rgba(2,8,14,0.12)" }}>
                      <input placeholder="Search name / state / village" className="outline-none bg-transparent" />
                    </div>
                    <div style={{ position: "absolute", left: 16, top: 86, background: "rgba(0,0,0,0.5)", color: "#fff", padding: 8, borderRadius: 10 }}>
                      ● Pharmacy &nbsp; ● Lab &nbsp; ● Ambulance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Portal Cards */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Choose your portal</h2>
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="transform hover:-translate-y-2 transition-all duration-300 shadow-xl card-entrance">
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center bg-teal-100/20 mb-4">
                <Building2 className="h-7 w-7 text-teal-300" />
              </div>
              <CardTitle>Clinic Portal</CardTitle>
              <CardDescription>For rural health workers and clinics</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Register patients & EHR</li>
                <li>• Create & track referrals</li>
                <li>• Local outreach workflow</li>
              </ul>
              <button
                onClick={(e) => handleCTAClick(e as any, "/clinic-login")}
                className="w-full mt-4 bg-teal-400 text-slate-900 hover:bg-teal-300 rounded-md py-2"
              >
                Open Clinic
              </button>
            </CardContent>
          </Card>

          <Card className="transform hover:-translate-y-2 transition-all duration-300 shadow-xl card-entrance">
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center bg-violet-100/20 mb-4">
                <Stethoscope className="h-7 w-7 text-violet-300" />
              </div>
              <CardTitle>Hospital Portal</CardTitle>
              <CardDescription>For doctors and hospital staff</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Review incoming referrals</li>
                <li>• Upload reports & update statuses</li>
                <li>• Coordinate with clinics</li>
              </ul>
              <Link to="/doctor-login" className="block mt-4">
                <Button className="w-full bg-violet-400 text-slate-900 hover:bg-violet-300">Open Hospital</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="transform hover:-translate-y-2 transition-all duration-300 shadow-xl card-entrance">
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center bg-amber-100/20 mb-4">
                <Shield className="h-7 w-7 text-amber-300" />
              </div>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>For government & administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Analytics & reporting</li>
                <li>• Manage users & clinics</li>
                <li>• Policy & outreach tools</li>
              </ul>
              <Link to="/admin-login" className="block mt-4">
                <Button className="w-full bg-amber-400 text-slate-900 hover:bg-amber-300">Open Admin</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Patient Records", desc: "Secure EHR accessible offline-first", accent: "teal" },
            { title: "Referral Tracking", desc: "Audit trail & real-time updates", accent: "violet" },
            { title: "Analytics", desc: "Geographic and disease trends", accent: "teal" },
            { title: "Secure Access", desc: "Role-based access & logging", accent: "amber" },
          ].map((f) => (
            <div key={f.title} className="feature-card" data-accent={f.accent}>
              <div className="feature-card-inner">
                <div className="h-12 w-12 rounded-full bg-white/6 flex items-center justify-center mb-4 icon-spot">
                  <Activity className="h-6 w-6 text-teal-200" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-300">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ChatBot />

      <footer className="border-t border-white/6 mt-12 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MediBridge — Built for rural healthcare outreach.
        </div>
      </footer>

      {/* inline animations */}
      <style>{`
        @keyframes drift {
          0%{transform:translateX(-15%) translateY(-5%) rotate(0deg)}
          50%{transform:translateX(15%) translateY(5%) rotate(3deg)}
          100%{transform:translateX(-15%) translateY(-5%) rotate(0deg)}
        }
        @keyframes floaty {
          0%{transform:translateY(0) translateX(0) rotate(0)}
          50%{transform:translateY(-18px) translateX(6px) rotate(3deg)}
          100%{transform:translateY(0) translateX(0) rotate(0)}
        }
        @media (prefers-reduced-motion: reduce) {
          .map-card, .map-inner, .splash-heart-svg, .splash-heart-path { transition: none !important; animation: none !important; }
        }
        .reveal { opacity: 0; transform: translateY(10px); transition: all .6s cubic-bezier(.2,.9,.3,1); }
        .reveal.visible { opacity: 1; transform: none; }
      `}</style>
    </div>
  );
}
