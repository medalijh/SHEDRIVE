"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface UseAuthState {
  user: {
    id: string;
    email?: string;
    phone?: string;
  } | null;
  profile: {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
    avatar_url: string | null;
    role: "passenger" | "driver" | "admin";
    status: string;
    city: string | null;
    rating: number;
    total_rides: number;
    preferred_language: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) return;
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const supabase = getSupabaseClient();

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setState({ user: null, profile: null, loading: false, error: null });
          return;
        }

        const profile = await fetchProfile(user.id);
        
        setState({
          user: {
            id: user.id,
            email: user.email ?? undefined,
            phone: user.phone ?? undefined,
          },
          profile,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Auth init error:", err);
        setState({ user: null, profile: null, loading: false, error: "Erreur d'authentification" });
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setState({ user: null, profile: null, loading: false, error: null });
          return;
        }

        const profile = await fetchProfile(session.user.id);
        setState({
          user: {
            id: session.user.id,
            email: session.user.email ?? undefined,
            phone: session.user.phone ?? undefined,
          },
          profile,
          loading: false,
          error: null,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      window.location.href = "/auth/login";
      return;
    }
    
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setState({ user: null, profile: null, loading: false, error: null });
    window.location.href = "/auth/login";
  }, []);

  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      if (profile) {
        setState(prev => ({ ...prev, profile }));
      }
    }
  }, [state.user, fetchProfile]);

  return {
    ...state,
    signOut,
    refreshProfile,
    isAuthenticated: !!state.user,
    isPassenger: state.profile?.role === "passenger",
    isDriver: state.profile?.role === "driver",
    isAdmin: state.profile?.role === "admin",
  };
}
