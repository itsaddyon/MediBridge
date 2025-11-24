// ThemeToggle.tsx
import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "medibridge_theme";

function applyTheme(theme: Theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  } else {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return (s as Theme) ?? "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    // apply initial theme
    applyTheme(theme);

    // if system, listen for changes
    const mql = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") applyTheme("system");
    };
    if (mql && mql.addEventListener) {
      mql.addEventListener("change", handleChange);
    } else if (mql && (mql as any).addListener) {
      (mql as any).addListener(handleChange);
    }

    return () => {
      if (mql && mql.removeEventListener) {
        mql.removeEventListener("change", handleChange);
      } else if (mql && (mql as any).removeListener) {
        (mql as any).removeListener(handleChange);
      }
    };
  }, [theme]);

  function nextTheme() {
    const order: Theme[] = ["light", "dark", "system"];
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    setTheme(next);
    applyTheme(next);
  }

  const title =
    theme === "light" ? "Light theme (click to switch)" : theme === "dark" ? "Dark theme (click to switch)" : "System theme (follows OS) — click to switch";

  return (
    <button
      aria-label={title}
      title={title}
      onClick={nextTheme}
      className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-transparent text-sm transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${className}`}
    >
      {theme === "light" ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="sr-only">Light</span>
        </>
      ) : theme === "dark" ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="sr-only">Dark</span>
        </>
      ) : (
        <>
          <Monitor className="w-4 h-4" />
          <span className="sr-only">System</span>
        </>
      )}
      {/* small visible label for clarity on wide screens */}
      <span className="hidden sm:inline text-xs text-muted-foreground">
        {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
      </span>
    </button>
  );
}
