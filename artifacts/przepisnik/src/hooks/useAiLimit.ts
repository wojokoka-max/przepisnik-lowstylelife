import { useEffect, useState, useCallback } from "react";

export const AI_DAILY_LIMIT = 3;
const STORAGE_KEY = "pp-ai-usage";
const EVENT_NAME = "pp-ai-usage-changed";
const ADMIN_KEY = "pp-admin";

function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ADMIN_KEY) === "1";
  } catch {
    return false;
  }
}

interface Usage {
  date: string; // YYYY-MM-DD (lokalna data)
  count: number;
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function readUsage(): Usage {
  if (typeof window === "undefined") return { date: todayKey(), count: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw) as Partial<Usage>;
    const today = todayKey();
    if (parsed.date !== today) return { date: today, count: 0 };
    const c = typeof parsed.count === "number" && parsed.count >= 0 ? parsed.count : 0;
    return { date: today, count: c };
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function writeUsage(u: Usage) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
}

/** Hook do śledzenia dziennego limitu AI (3/dobę, reset o północy lokalnej). */
export function useAiLimit() {
  const [usage, setUsage] = useState<Usage>(() => readUsage());

  useEffect(() => {
    const refresh = () => setUsage(readUsage());
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    // resetuje też po przekroczeniu północy podczas otwartej karty
    const tick = window.setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.clearInterval(tick);
    };
  }, []);

  const admin = isAdmin();
  const remaining = admin ? Infinity : Math.max(0, AI_DAILY_LIMIT - usage.count);
  const canUse = admin || remaining > 0;

  /** Spróbuj zużyć jedno użycie. Zwraca true jeśli się powiodło. */
  const consume = useCallback((): boolean => {
    if (isAdmin()) return true;
    const fresh = readUsage();
    if (fresh.count >= AI_DAILY_LIMIT) return false;
    writeUsage({ date: fresh.date, count: fresh.count + 1 });
    return true;
  }, []);

  return { remaining, canUse, limit: AI_DAILY_LIMIT, consume, isAdmin: admin };
}
