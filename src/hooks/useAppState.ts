"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { INITIAL_APP_STATE } from "@/data/initialData";
import type { AppState } from "@/types";

const SAVE_DEBOUNCE_MS = 800;

/**
 * Loads AppState from Supabase on mount, and persists it back (debounced)
 * whenever it changes — the same "load once, save on every change" shape
 * App.tsx already used with localStorage, just backed by a real database
 * now so it survives across devices and browsers.
 *
 * Debounced rather than saved on every keystroke: several fields in this
 * app (journal text, gratitude scan answers) update on every character
 * typed, and writing to Supabase that often would be wasteful and slow.
 */
export function useAppState() {
  const supabase = createClient();
  const [appState, setAppState] = useState<AppState>(INITIAL_APP_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data, error: fetchError } = await supabase
        .from("app_states")
        .select("state")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data?.state) {
        // Merge over defaults so new fields added in later app versions
        // (e.g. a new settings flag) don't crash on old saved data.
        setAppState({ ...INITIAL_APP_STATE, ...(data.state as AppState) });
      }
      hasLoaded.current = true;
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip the save that would otherwise fire immediately after the initial
    // load populates state from Supabase — that's not a real change.
    if (!hasLoaded.current) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error: saveError } = await supabase
        .from("app_states")
        .upsert({ user_id: user.id, state: appState, updated_at: new Date().toISOString() });

      if (saveError) setError(saveError.message);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  const resetState = useCallback(() => {
    setAppState(INITIAL_APP_STATE);
  }, []);

  return { appState, setAppState, loading, error, resetState };
}
