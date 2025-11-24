// File: AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity, Shield, Stethoscope, Heart, Clipboard, Pill } from "lucide-react";


const ADMIN_CREDENTIAL = { email: "admin@gmail.com", password: "admin123" };

function AdminIcons() {
  const ICONS = [
    { Comp: Shield, color: "#60a5fa" },
    { Comp: Stethoscope, color: "#10b981" },
    { Comp: Heart, color: "#ef4444" },
    { Comp: Clipboard, color: "#8b5cf6" },
    { Comp: Pill, color: "#f97316" },
    { Comp: Activity, color: "#06b6d4" },
  ];

  const icons = Array.from({ length: 14 }).map((_, i) => {
    const pick = ICONS[i % ICONS.length];
    const size = Math.floor(Math.random() * 26) + 30; // 30..55px
    const left = Math.random() * 92;
    const top = Math.random() * 86;
    const delay = (Math.random() * 4).toFixed(2) + "s";
    const duration = (6 + Math.random() * 8).toFixed(2) + "s";
    const rotate = (Math.random() * 60 - 30).toFixed(0) + "deg";
    const anim = i % 3 === 0 ? "spinFloat" : i % 3 === 1 ? "floatTint" : "floatDrift";
    return { Comp: pick.Comp, color: pick.color, size, left, top, delay, duration, rotate, anim, key: `admin-icon-${i}`, pulse: Math.random() > 0.78 };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <style>{`
        .auth-icon { position:absolute; opacity:0.95; transform-origin:center; filter: drop-shadow(0 10px 24px rgba(2,6,23,0.06)); }
        @keyframes spinFloat { 0%{transform:translateY(0) rotate(0deg) scale(1)} 50%{transform:translateY(-28px) rotate(180deg) scale(1.03)} 100%{transform:translateY(0) rotate(360deg) scale(1)} }
        @keyframes floatTint { 0%{transform:translateY(0) scale(1) rotate(0deg)} 50%{transform:translateY(-34px) scale(1.06) rotate(12deg)} 100%{transform:translateY(0) scale(1) rotate(0deg)} }
        @keyframes floatDrift { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(-12px,-20px) rotate(-8deg)} 50%{transform:translate(10px,-30px) rotate(18deg)} 75%{transform:translate(-6px,-12px) rotate(-6deg)} 100%{transform:translate(0,0) rotate(0deg)} }
        @keyframes tinyPulse { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
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
          <div key={it.key} className="auth-icon" style={{ ...style, ...pulseStyle }}>
            <it.Comp className="w-full h-full" stroke={it.color} />
          </div>
        );
      })}
    </div>
  );
}

export default function AdminLogin() {
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
      if (email.trim() === ADMIN_CREDENTIAL.email && password === ADMIN_CREDENTIAL.password) {
        localStorage.setItem("medibridge_token", btoa("admin:" + Date.now()));
        localStorage.setItem("medibridge_role", "admin");
        navigate("/admin/dashboard");
      } else {
        setError("Incorrect email or password");
      }
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <AdminIcons />
      <div className="absolute -inset-2 blur-3xl opacity-35" style={{ background: "radial-gradient(circle at 10% 20%, rgba(96,165,250,0.10), transparent 20%), radial-gradient(circle at 80% 80%, rgba(240,171,252,0.06), transparent 25%)" }} />

      <div className="w-full max-w-md">
        <Card className="p-0 rounded-xl shadow-2xl backdrop-blur bg-white/60 border border-white/10">
          <CardHeader className="text-center py-6">
            <div className="flex items-center justify-center gap-3">
              <Activity className="h-8 w-8" />
              <h2 className="text-2xl font-semibold">MediBridge — Admin</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Secure admin access</p>
          </CardHeader>
          <CardContent>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" value={email} onChange={e => setEmail(e.target.value)} placeholder={ADMIN_CREDENTIAL.email} autoComplete="username" />
              </div>
              <div>
                <Label htmlFor="admin-pass">Password</Label>
                <Input id="admin-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in as Admin"}</Button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground">Demo: {ADMIN_CREDENTIAL.email} / {ADMIN_CREDENTIAL.password}</div>
            <div className="mt-4 text-center"><Link to="/" className="text-sm hover:underline">Back to Home</Link></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
