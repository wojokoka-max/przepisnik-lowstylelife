// AsyncStorage port webowego useAiLimit (3 generacje AI / dobę).
// Admin (kontakt@lowstylelife.art) ma nielimitowany dostęp.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

export const AI_DAILY_LIMIT = 3;
const STORAGE_KEY = "pp-ai-usage";

interface Usage {
  date: string;
  count: number;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function readUsage(): Promise<Usage> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
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

async function writeUsage(u: Usage): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } catch {
    /* ignore */
  }
}

export function useAiLimit() {
  const { isAdmin } = useAuth();
  const [usage, setUsage] = useState<Usage>({ date: todayKey(), count: 0 });

  useEffect(() => {
    let cancelled = false;
    readUsage().then((u) => {
      if (!cancelled) setUsage(u);
    });
    const tick = setInterval(() => {
      readUsage().then((u) => {
        if (!cancelled) setUsage(u);
      });
    }, 60_000);
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, []);

  const remaining = isAdmin ? Infinity : Math.max(0, AI_DAILY_LIMIT - usage.count);
  const canUse = isAdmin || remaining > 0;

  const consume = useCallback(async (): Promise<boolean> => {
    if (isAdmin) return true;
    const fresh = await readUsage();
    if (fresh.count >= AI_DAILY_LIMIT) return false;
    const next = { date: fresh.date, count: fresh.count + 1 };
    await writeUsage(next);
    setUsage(next);
    return true;
  }, [isAdmin]);

  return {
    remaining,
    canUse,
    limit: isAdmin ? Infinity : AI_DAILY_LIMIT,
    consume,
    unlimited: isAdmin,
  };
}
