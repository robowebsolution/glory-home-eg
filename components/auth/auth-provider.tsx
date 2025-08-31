"use client"

import type React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";
import type { Profile } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, session: _initialSession }: { children: React.ReactNode; session?: Session | null }) {
  const [session, setSession] = useState<Session | null>(_initialSession ?? null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Track the latest fetch to ignore stale results
  const reqIdRef = useRef(0);

  // Utility: ensure long network calls can't hang the UI
  const withTimeout = <T,>(promise: Promise<T>, ms = 3000) => {
    return Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)) as Promise<T>,
    ]);
  };

  const user = session?.user ?? null;

  const fetchProfileAndAdminStatus = useCallback(async (userId: string | undefined) => {
    const myId = ++reqIdRef.current;
    if (!userId) {
      setIsAdmin(false);
      setProfile(null);
      return;
    }

    try {
      const [profileResult, adminResult] = await withTimeout(Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("admin_users").select("user_id").eq("user_id", userId).single(),
      ]), 3000);

      // Ignore if a newer request has been made
      if (myId !== reqIdRef.current) return;

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileResult.error);
      }
      setProfile(profileResult.data);
      setIsAdmin(!adminResult.error && !!adminResult.data);
    } catch (error) {
      if (myId !== reqIdRef.current) return;
      console.error("Error in fetchProfileAndAdminStatus:", error);
      setIsAdmin(false);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, s: Session | null) => {
        // On auth changes, update state but do NOT block the UI with loading
        setSession(s);
        fetchProfileAndAdminStatus(s?.user?.id);
      }
    );

    // Fetch initial session (only time we show the loading screen)
    const getInitialSession = async () => {
      try {
        const res = await withTimeout(supabase.auth.getSession(), 3000) as { data: { session: Session | null } };
        const session = res.data.session;
        setSession(session);
        await fetchProfileAndAdminStatus(session?.user?.id);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setSession(null);
        setIsAdmin(false);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfileAndAdminStatus]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfileAndAdminStatus(user.id);
    }
  }, [user, fetchProfileAndAdminStatus]);

  const value = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
