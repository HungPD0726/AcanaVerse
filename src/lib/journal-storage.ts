"use client";

export interface JournalEntry {
  id: string;
  createdAt: string;
  question: string;
  spreadSlug: string;
  deckSlug: string;
  drawnCardIds: string[];
}

const STORAGE_KEY = "arcana-journal-v1";

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const entries = getJournalEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...entries].slice(0, 50); // Keep last 50 entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
