"use client";

import { useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { signIn, signOut, signUp } from "@/services/auth.service";
import { useAuthContext } from "@/components/providers/AuthProvider";

export function useAuth() {
  const { user, loading } = useAuthContext();
  const supabase = useMemo(() => createClient(), []);

  const login = useCallback(
    (email: string, password: string) => signIn(supabase, email, password),
    [supabase]
  );
  const register = useCallback(
    (email: string, password: string) => signUp(supabase, email, password),
    [supabase]
  );
  const logout = useCallback(() => signOut(supabase), [supabase]);

  return { user, loading, login, register, logout };
}
