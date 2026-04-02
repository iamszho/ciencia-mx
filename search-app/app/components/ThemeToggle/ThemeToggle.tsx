"use client";

import { SunMoon } from "lucide-react";
import "./theme-toggle.css";

type ThemeMode = "light" | "dark";

export default function ThemeToggle() {
  const getEffectiveTheme = (): ThemeMode => {
    const forcedTheme = document.documentElement.getAttribute("data-theme");
    if (forcedTheme === "dark" || forcedTheme === "light") {
      return forcedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const toggleTheme = () => {
    const currentTheme = getEffectiveTheme();
    const nextTheme: ThemeMode = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Alternar tema claro/oscuro"
      title="Alternar tema claro/oscuro"
    >
      <SunMoon size={18} />
    </button>
  );
}
