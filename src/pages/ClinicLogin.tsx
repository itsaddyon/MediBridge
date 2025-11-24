// File: ClinicLogin.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Building2,
  Syringe,
  Heart,
  Bandage,
  Pill,
  Clipboard,
  Stethoscope,
} from "lucide-react";

const CLINIC_CREDENTIAL = {
  email: "clinic@gmail.com",
  password: "clinic123",
  altIds: ["phc-rampur", "clinic123"],
};

function ClinicIcons() {
  // pool of icons and their stroke colors
  const ICONS = [
    { Comp: Syringe, color: "#60a5fa" },
    { Comp: Heart, color: "#fb7185" },
    { Comp: Bandage, color: "#f59e0b" },
    { Comp: Building2, color: "#8b5cf6" },
    { Comp: Pill, color: "#f97316" },
    { Comp: Clipboard, color: "#8b5cf6" },
    { Comp: Stethoscope, color: "#10b981" },
  ];

  // create a list of icon instances (increase count to add more)
  const icons = Array.from({ length: 14 }).map((_, i) => {
    const pick = ICONS[i % ICONS.length];
    const size = Math.floor(Math.random() * 26) + 28; // 28..53px
    const left = Math.random() * 92; // percent
    const top = Math.random() * 86;
    const delay = (Math.random() * 4).toFixed(2) + "s";
    const duration = (6 + Math.random() * 8).toFixed(2) + "s"; // 6..14s
    const rotate = (Math.random() * 60 - 30).toFixed(0) + "deg"; // -30..30deg
    const anim = i % 3 === 0 ? "spinFloat" : i % 3 === 1 ? "floatTint" : "floatDrift";
    return {
      Comp: pick.Comp,
      color: pick.color,
      size,
      left,
      top,
      delay,
      duration,
      rotate,
      anim,
      key: `clinic-icon-${i}`,
      pulse: Math.random() > 0.78, // a few will pulse
    };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <style>{`
        .clinic-icon {
          position: absolute;
          opacity: 0.95;
          transform-origin: center;
          filter: drop-shadow(0 10px 24px rgba(2,6,23,0.06));
        }

        @keyframes spinFloat {
          0% { transform: translateY(0) rotate(0deg) scale(1) }
          50% { transform: translateY(-28px) rotate(180deg) scale(1.03) }
          100% { transform: translateY(0) rotate(360deg) scale(1) }
        }
        @keyframes floatTint {
          0% { transform: translateY(0) scale(1) rotate(0deg) }
          50% { transform: translateY(-34px) scale(1.06) rotate(12deg) }
          100% { transform: translateY(0) scale(1) rotate(0deg) }
        }
        @keyframes floatDrift {
          0% { transform: translate(0,0) rotate(0deg) }
          25% { transform: translate(-12px,-20px) rotate(-8deg) }
          50% { transform: translate(10px,-30px) rotate(18deg) }
          75% { transform: translate(-6px,-12px) rotate(-6deg) }
          100% { transform: translate(0,0) rotate(0deg) }
        }
        @keyframes tinyPulse {
          0% { transform: scale(1) }
          50% { transform: scale(1.04) }
          100% { transform: scale(1) }
        }
      `}</style>

      {icons.map((it) => {
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
          <div key={it.key} className="clinic-icon" style={{ ...style, ...pulseStyle }}>
            <it.Comp className="w-full h-full" stroke={it.color} />
          </div>
        );
      })}
    </div>
  );
}

export default function ClinicLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!id.trim()) return "Enter clinic email or ID";
    if (!password) return "Enter password";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const ok =
        id.trim() === CLINIC_CREDENTIAL.email || CLINIC_CREDENTIAL.altIds.includes(id.trim().toLowerCase());
      if (ok && password === CLINIC_CREDENTIAL.password) {
        localStorage.setItem("medibridge_token", btoa("clinic:" + Date.now()));
        localStorage.setItem("medibridge_role", "clinic");
        navigate("/clinic/dashboard");
      } else {
        setError("Incorrect clinic identifier or password");
      }
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <ClinicIcons />
      <div
        className="absolute -inset-2 blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(99,102,241,0.08), transparent 20%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.05), transparent 25%)",
        }}
      />

      <div className="w-full max-w-md">
        <Card className="p-0 rounded-xl shadow-2xl backdrop-blur bg-white/60 border border-white/10">
          <CardHeader className="text-center py-6">
            <div className="flex items-center justify-center gap-3">
              <Building2 className="h-8 w-8" />
              <h2 className="text-2xl font-semibold">MediBridge — Clinic</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Clinic / PHC login</p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded mb-3">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="clinic-id">Clinic Email or ID</Label>
                <Input
                  id="clinic-id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder={`${CLINIC_CREDENTIAL.email} or PHC ID`}
                />
              </div>
              <div>
                <Label htmlFor="clinic-pass">Password</Label>
                <Input
                  id="clinic-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in as Clinic"}
              </Button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground">
              Demo: {CLINIC_CREDENTIAL.email} / {CLINIC_CREDENTIAL.password} (or try <code>phc-rampur</code>)
            </div>
            <div className="mt-4 text-center">
              <Link to="/" className="text-sm hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
