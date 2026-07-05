// Authentication backed by Clerk.
//
// Two login paths:
//   • Regular users  → email + password (handled in LoginOverlay via Clerk).
//   • Admin (owner)  → GitHub with the admin GitHub username below.
//     Any other GitHub account is rejected.
//
// This file keeps the same surface the rest of the app already consumes
// (ready, user, isAdmin, signOut) so screens don't need to change.

import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/expo";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// The single GitHub account that is granted admin access.
export const ADMIN_GITHUB_USERNAME =
  process.env.EXPO_PUBLIC_ADMIN_GITHUB_USERNAME?.trim().toLowerCase() ||
  "wojokoka-max";

export interface User {
  email: string;
}

interface AuthCtx {
  ready: boolean;
  user: User | null;
  isAdmin: boolean;
  /** True when someone signed in with a GitHub account that is NOT the admin. */
  githubAccessDenied: boolean;
  clearGithubAccessDenied: () => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

type ClerkUserLike = {
  username?: string | null;
  primaryEmailAddress?: { emailAddress?: string } | null;
  emailAddresses?: { emailAddress?: string }[];
  externalAccounts?: { provider?: string; username?: string | null }[];
};

function githubAccountOf(u: ClerkUserLike | null | undefined) {
  return (u?.externalAccounts ?? []).find((a) =>
    (a.provider ?? "").toLowerCase().includes("github"),
  );
}

function githubUsernameOf(u: ClerkUserLike | null | undefined): string | null {
  const fromExt = githubAccountOf(u)?.username ?? null;
  return fromExt || u?.username || null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [denied, setDenied] = useState(false);

  // Attach the Clerk session token to generated API calls (mobile has no cookie jar).
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  const cu = clerkUser as ClerkUserLike | null;
  const hasGithub = !!githubAccountOf(cu);
  const ghUsername = githubUsernameOf(cu);
  const isAdminGithub =
    hasGithub && ghUsername?.toLowerCase() === ADMIN_GITHUB_USERNAME;
  // A GitHub login that is not the admin account is not allowed anywhere.
  const githubNotAllowed = hasGithub && !isAdminGithub;

  // Reject non-admin GitHub sign-ins.
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (githubNotAllowed) {
      setDenied(true);
      void clerkSignOut();
    }
  }, [isLoaded, isSignedIn, githubNotAllowed, clerkSignOut]);

  const email =
    cu?.primaryEmailAddress?.emailAddress ??
    cu?.emailAddresses?.[0]?.emailAddress ??
    "";

  const user: User | null =
    isSignedIn && cu && !githubNotAllowed ? { email } : null;

  const value = useMemo<AuthCtx>(
    () => ({
      ready: isLoaded,
      user,
      isAdmin: isAdminGithub,
      githubAccessDenied: denied,
      clearGithubAccessDenied: () => setDenied(false),
      signOut: async () => {
        setDenied(false);
        await clerkSignOut();
      },
    }),
    [isLoaded, user, isAdminGithub, denied, clerkSignOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
