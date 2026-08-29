import { AppState } from '../types';
import { INITIAL_APP_STATE, getTodayDateString } from '../data/initialData';

// NOTE: this file used to own localStorage read/write directly. Persistence
// now lives in Supabase — see hooks/useAppState.ts, which loads on mount and
// saves (debounced) on every change. What's left here are pure, synchronous
// helpers that operate on in-memory AppState only: export/import/reset all
// just return a new AppState, and the caller's setAppState(...) triggers the
// existing save effect to persist it. This kept every component that already
// imports these three functions unchanged.

export function exportAppDataJson(state: AppState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `steward-os-backup-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export const exportAppStateAsJSON = exportAppDataJson;

export function importAppDataJson(jsonString: string): AppState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && parsed.routines && parsed.settings) {
      return parsed as AppState;
    }
  } catch (e) {
    console.error('Invalid JSON backup file:', e);
  }
  return null;
}

export const importAppStateFromJSON = importAppDataJson;

export function resetToDefaultState(): AppState {
  return INITIAL_APP_STATE;
}

export { getTodayDateString };
