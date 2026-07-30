"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { DemoUser } from "@/domain/tarot";

interface AuthContextValue {
  user: DemoUser | null;
  isReady: boolean;
  signIn(user: DemoUser): void;
  signOut(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const DEMO_USER_STORAGE_KEY = "arcana-demo-user-v1";
const AUTH_CHANGE_EVENT = "arcana-auth-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(DEMO_USER_STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function parseUser(value: string | null): DemoUser | null {
  if (!value) {
    return null;
  }
  try {
    const stored = JSON.parse(value) as DemoUser;
    if (stored.email && stored.displayName) {
      return stored;
    }
  } catch {
    return null;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const user = parseUser(storedValue);

  const signIn = (nextUser: DemoUser) => {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(nextUser));
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  const signOut = () => {
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  };

  return (
    <AuthContext value={{ user, isReady: true, signIn, signOut }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
