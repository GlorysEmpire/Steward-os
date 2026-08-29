import type { AppState } from "../types";

export interface Database {
  public: {
    Tables: {
      app_states: {
        Row: {
          user_id: string;
          state: AppState;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          state: AppState;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          state?: AppState;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
