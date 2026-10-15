import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '../types/database';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isBackendConfigured: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, fullName: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfileName: (name: string) => Promise<void>;
  // Project brief draft preservation
  pendingBriefDraft: Record<string, unknown> | null;
  setPendingBriefDraft: (draft: Record<string, unknown> | null) => void;
  // Auth modal trigger
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PENDING_BRIEF_KEY = 'flixcore_pending_brief_draft';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [pendingBriefDraft, setPendingBriefDraftState] = useState<Record<string, unknown> | null>(() => {
    try {
      const saved = localStorage.getItem(PENDING_BRIEF_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setPendingBriefDraft = (draft: Record<string, unknown> | null) => {
    setPendingBriefDraftState(draft);
    if (draft) {
      localStorage.setItem(PENDING_BRIEF_KEY, JSON.stringify(draft));
    } else {
      localStorage.removeItem(PENDING_BRIEF_KEY);
    }
  };

  // Helper to fetch server-verified profile
  const fetchProfile = async (userId: string, userEmail: string, metaName?: string): Promise<Profile> => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      const isDesignatedAdmin = userEmail.trim().toLowerCase() === 'flixcorestudios@gmail.com';
      // If profile record does not yet exist, create it with appropriate role
      const newProfile: Profile = {
        id: userId,
        email: userEmail,
        full_name: metaName || userEmail.split('@')[0],
        role: isDesignatedAdmin ? 'admin' : 'customer',
        created_at: new Date().toISOString(),
      };
      await supabase.from('profiles').upsert(newProfile);
      return newProfile;
    }

    return profile as Profile;
  };

  // Initialize auth state via Supabase
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user && mounted) {
          const profile = await fetchProfile(
            data.session.user.id,
            data.session.user.email || '',
            data.session.user.user_metadata?.full_name
          );
          if (mounted) setUser(profile);
        }
      } catch (err) {
        console.warn('[Auth] Session check failed:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen to real auth state changes
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && mounted) {
          const profile = await fetchProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.full_name
          );
          if (mounted) setUser(profile);
        } else if (mounted) {
          setUser(null);
        }
      });

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error:
          'Backend service unavailable. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable customer accounts and ticketing.',
      };
    }

    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(
          data.user.id,
          data.user.email || normalizedEmail,
          data.user.user_metadata?.full_name
        );
        setUser(profile);
        setIsAuthModalOpen(false);
        return { success: true };
      }

      return { success: false, error: 'Unable to retrieve user credentials.' };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    fullName: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error:
          'Backend service unavailable. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable account creation.',
      };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { full_name: fullName.trim() } },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const isDesignatedAdmin = normalizedEmail === 'flixcorestudios@gmail.com';
        const newProfile: Profile = {
          id: data.user.id,
          email: normalizedEmail,
          full_name: fullName.trim(),
          role: isDesignatedAdmin ? 'admin' : 'customer',
          created_at: new Date().toISOString(),
        };

        await supabase.from('profiles').insert(newProfile);
        setUser(newProfile);
        setIsAuthModalOpen(false);
        return { success: true };
      }

      return { success: false, error: 'Registration did not return a user session.' };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: 'Backend service unavailable. Configure Supabase in .env to enable password resets.',
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox for authorization instructions.',
    };
  };

  const updateProfileName = async (name: string) => {
    if (!user || !supabase) return;
    const trimmed = name.trim();
    const updated: Profile = { ...user, full_name: trimmed, updated_at: new Date().toISOString() };
    setUser(updated);
    await supabase.from('profiles').update({ full_name: trimmed }).eq('id', user.id);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === 'admin',
        isBackendConfigured: isSupabaseConfigured,
        login,
        register,
        logout,
        resetPassword,
        updateProfileName,
        pendingBriefDraft,
        setPendingBriefDraft,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
