import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  /**
   * Initialize auth state from persisted session.
   * Call once on app startup.
   */
  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });

      if (session?.user) {
        await get().refreshProfile();
      }

      // Listen for auth state changes (sign in, sign out, token refresh)
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session });
        if (session?.user) {
          await get().refreshProfile();
        } else {
          set({ profile: null });
        }
      });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw new Error(error.message);
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  signUpWithEmail: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw new Error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },

  refreshProfile: async () => {
    const session = get().session;
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      set({
        profile: {
          id: data.id,
          email: session.user.email ?? '',
          name: data.name,
          currency: data.currency,
          monthlyBudget: data.monthly_budget,
          createdAt: data.created_at,
        },
      });
    }
  },
}));
