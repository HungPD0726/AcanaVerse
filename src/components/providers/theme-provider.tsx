"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type ThemeSetting = Theme | "system";

interface ThemeContextValue {
  theme: Theme;
  setting: ThemeSetting;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "arcana-theme";
const THEME_CHANGE_EVENT = "arcana-theme-change";

function readSetting(): ThemeSetting {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

function resolveTheme(setting: ThemeSetting): Theme {
  if (setting !== "system") {
    return setting;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    media.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  const setting = readSetting();
  return `${setting}:${resolveTheme(setting)}`;
}

function getServerSnapshot() {
  return "system:light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [settingValue, themeValue] = snapshot.split(":") as [
    ThemeSetting,
    Theme,
  ];

  useEffect(() => {
    document.documentElement.dataset.theme = themeValue;
    document.documentElement.style.colorScheme = themeValue;
  }, [themeValue]);

  const toggleTheme = () => {
    const next = themeValue === "light" ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <ThemeContext
      value={{ theme: themeValue, setting: settingValue, toggleTheme }}
    >
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
