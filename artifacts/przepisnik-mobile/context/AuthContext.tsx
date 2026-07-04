// Lightweight local auth (email + password) backed by AsyncStorage.
// Placeholder for future Clerk integration — same surface (user, signIn,
// signUp, signOut, isAdmin) so swapping later only touches this file.

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const ADMIN_EMAIL = "kontakt@lowstylelife.art";

const USERS_KEY = "pp-auth-users-v1";
const SESSION_KEY = "pp-auth-session-v1";

export interface User {
  email: string;
}

interface StoredUser {
  email: string;
  // Stored as plain hash-ish digest. NOT real security — local placeholder.
  passDigest: string;
}

interface AuthCtx {
  ready: boolean;
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signUp: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

// Simple non-cryptographic digest. Enough to avoid plaintext-in-storage.
function digest(s: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0xdeadbeef;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Restore session on boot. Also auto-provision admin so the owner can log
  // in on a fresh device with a known password.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const users = await readUsers();
        if (!users.some((u) => u.email === ADMIN_EMAIL)) {
          users.push({ email: ADMIN_EMAIL, passDigest: digest("lowstyle") });
          await writeUsers(users);
        }
        const sessionRaw = await AsyncStorage.getItem(SESSION_KEY);
        let restored = false;
        if (sessionRaw) {
          const parsed = JSON.parse(sessionRaw) as { email?: string };
          if (parsed?.email && users.some((u) => u.email === parsed.email)) {
            if (!cancelled) setUser({ email: parsed.email });
            restored = true;
          }
        }
        // W trybie deweloperskim (podgląd w Replit) adres podglądu zmienia
        // się między restartami, więc lokalna sesja przepada. Żeby właścicielka
        // nie musiała logować się przy każdym restarcie — auto-logujemy admina.
        // W opublikowanej aplikacji (__DEV__ === false) logowanie działa normalnie.
        if (!restored && __DEV__) {
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email: ADMIN_EMAIL }));
          if (!cancelled) setUser({ email: ADMIN_EMAIL });
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (emailRaw: string, password: string) => {
    const email = normalize(emailRaw);
    if (!email || !email.includes("@")) return { ok: false as const, error: "Podaj poprawny adres email." };
    if (!password) return { ok: false as const, error: "Podaj hasło." };
    const users = await readUsers();
    const found = users.find((u) => u.email === email);
    if (!found) return { ok: false as const, error: "Nie znaleziono konta. Załóż je poniżej." };
    if (found.passDigest !== digest(password)) return { ok: false as const, error: "Nieprawidłowe hasło." };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    setUser({ email });
    return { ok: true as const };
  }, []);

  const signUp = useCallback(async (emailRaw: string, password: string) => {
    const email = normalize(emailRaw);
    if (!email || !email.includes("@") || email.length < 5) {
      return { ok: false as const, error: "Podaj poprawny adres email." };
    }
    if (password.length < 6) return { ok: false as const, error: "Hasło musi mieć min. 6 znaków." };
    const users = await readUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false as const, error: "Konto z tym adresem już istnieje. Zaloguj się." };
    }
    users.push({ email, passDigest: digest(password) });
    await writeUsers(users);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    setUser({ email });
    return { ok: true as const };
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      ready,
      user,
      isAdmin: user?.email === ADMIN_EMAIL,
      signIn,
      signUp,
      signOut,
    }),
    [ready, user, signIn, signUp, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
