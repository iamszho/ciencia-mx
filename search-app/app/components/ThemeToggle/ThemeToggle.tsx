"use client";

import { useEffect } from "react";
import { SunMoon } from "lucide-react";
import "./theme-toggle.css";

type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "ciencia-mx-theme";

export default function ThemeToggle() {
  const applyTheme = (theme: ThemeMode) => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

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
    applyTheme(nextTheme);
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
