import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

async function handleAuthUrl(url: string) {
  try {
    // PKCE flow — URL has ?code=...
    if (url.includes("code=")) {
      await supabase.auth.exchangeCodeForSession(url);
      return;
    }
    // Implicit flow — URL has #access_token=... (or ?access_token=...)
    if (url.includes("access_token=")) {
      const fragment = url.includes("#")
        ? url.split("#")[1]
        : url.split("?")[1] ?? "";
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }
  } catch (err) {
    console.warn("[AuthProvider] deep-link auth failed:", err);
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Keep session in sync on sign-in / sign-out / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Handle deep link that opened the app (cold start from email link)
    Linking.getInitialURL().then((url) => {
      if (url) handleAuthUrl(url);
    });

    // Handle deep link while app is already running
    const linkSub = Linking.addEventListener("url", ({ url }) => {
      handleAuthUrl(url);
    });

    return () => {
      subscription.unsubscribe();
      linkSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
