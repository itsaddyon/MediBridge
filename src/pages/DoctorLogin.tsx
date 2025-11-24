// File: DoctorLogin.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Stethoscope, Syringe, Heart, Bandage, Pill, Clipboard } from "lucide-react";

const DOCTOR_CREDENTIAL = { email: "doctor@gmail.com", password: "doctor123" };

function DoctorIcons() {
  const ICONS = [
    { Comp: Stethoscope, color: "#10b981" },
    { Comp: Syringe, color: "#60a5fa" },
    { Comp: Heart, color: "#ef4444" },
    { Comp: Bandage, color: "#f59e0b" },
    { Comp: Pill, color: "#f97316" },
    { Comp: Clipboard, color: "#8b5cf6" },
  ];

  const icons = Array.from({ length: 14 }).map((_, i) => {
    const pick = ICONS[i % ICONS.length];
    const size = Math.floor(Math.random() * 26) + 28;
    const left = Math.random() * 92;
    const top = Math.random() * 86;
    const delay = (Math.random() * 4).toFixed(2) + "s";
    const duration = (6 + Math.random() * 8).toFixed(2) + "s";
    const rotate = (Math.random() * 60 - 30).toFixed(0) + "deg";
    const anim = i % 3 === 0 ? "wiggle" : i % 3 === 1 ? "floatFast" : "floatSlow";
    return { Comp: pick.Comp, color: pick.color, size, left, top, delay, duration, rotate, anim, key: `doctor-icon-${i}`, pulse: Math.random() > 0.78 };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <style>{`
        .doc-icon { position:absolute; opacity:0.95; transform-origin:center; filter: drop-shadow(0 10px 24px rgba(2,6,23,0.06)); }
        @keyframes wiggle { 0%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-16px) rotate(-8deg)}50%{transform:translateY(0) rotate(0deg)}75%{transform:translateY(-10px) rotate(10deg)}100%{transform:translateY(0) rotate(0deg)} }
        @keyframes floatFast { 0%{transform:translateY(0)}50%{transform:translateY(-26px)}100%{transform:translateY(0)} }
        @keyframes floatSlow { 0%{transform:translateY(0)}50%{transform:translateY(-34px)}100%{transform:translateY(0)} }
        @keyframes tinyPulse { 0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)} }
      `}</style>

      {icons.map(it => {
        const style: React.CSSProperties = {
          left: `${it.left}%`,
          top: `${it.top}%`,
          width: `${it.size}px`,
          height: `${it.size}px`,
          animationName: it.anim,
          animationDuration: it.duration,
          animationTimingFunction: "ease-in-out",
          animationDelay: it.delay,
          animationIterationCount: "infinite",
          transform: `rotate(${it.rotate})`,
        };
        const pulseStyle = it.pulse ? { animation: `tinyPulse ${4 + Math.random() * 3}s ease-in-out infinite` } : {};
        return (
          <div key={it.key} className="doc-icon" style={{ ...style, ...pulseStyle }}>
            <it.Comp className="w-full h-full" stroke={it.color} />
          </div>
        );
      })}
    </div>
  );
}

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() { if (!email.trim()) return "Enter email"; if (!password) return "Enter password"; return null; }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    const v = validate(); if (v) { setError(v); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.trim() === DOCTOR_CREDENTIAL.email && password === DOCTOR_CREDENTIAL.password) {
        localStorage.setItem("medibridge_token", btoa("doctor:" + Date.now()));
        localStorage.setItem("medibridge_role", "doctor");
        navigate("/doctor/dashboard");
      } else {
        setError("Incorrect email or password");
      }
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <DoctorIcons />
      <div className="absolute -inset-2 blur-3xl opacity-30" style={{ background: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.06), transparent 20%), radial-gradient(circle at 85% 70%, rgba(99,102,241,0.05), transparent 25%)" }} />

      <div className="w-full max-w-md">
        <Card className="p-0 rounded-xl shadow-2xl backdrop-blur bg-white/60 border border-white/10">
          <CardHeader className="text-center py-6">
            <div className="flex items-center justify-center gap-3">
              <Stethoscope className="h-8 w-8" />
              <h2 className="text-2xl font-semibold">MediBridge — Doctor</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Hospital / Doctor access</p>
          </CardHeader>
          <CardContent>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="doc-email">Email</Label>
                <Input id="doc-email" value={email} onChange={e => setEmail(e.target.value)} placeholder={DOCTOR_CREDENTIAL.email} />
              </div>
              <div>
                <Label htmlFor="doc-pass">Password</Label>
                <Input id="doc-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in as Doctor"}</Button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground">Demo: {DOCTOR_CREDENTIAL.email} / {DOCTOR_CREDENTIAL.password}</div>
            <div className="mt-4 text-center"><Link to="/" className="text-sm hover:underline">Back to Home</Link></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
