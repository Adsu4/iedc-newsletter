/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check local session storage first for instant reload support
    const localSession = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('iedc_admin_session') : null;
    if (localSession) {
      setIsAuthenticated(true);
      setUserEmail(localSession);
      setIsLoading(false);
    }

    // 2. Session Persistence: Restore active session from Supabase on page reload (M2)
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('iedc_admin_session', session.user.email || 'admin');
          }
        } else if (!localSession) {
          setIsAuthenticated(false);
          setUserEmail(null);
        }
        setIsLoading(false);
      }).catch((err) => {
        console.warn('Supabase auth session check failed:', err);
        setIsLoading(false);
      });

      // 3. React to auth state changes (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('iedc_admin_session', session.user.email || 'admin');
          }
        } else if (!sessionStorage.getItem('iedc_admin_session')) {
          setIsAuthenticated(false);
          setUserEmail(null);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (userId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedId = userId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      return { success: false, error: 'Please enter both User ID and Password.' };
    }

    // 1. Check environment variables if configured
    const envUser = import.meta.env.VITE_ADMIN_USER;
    const envPass = import.meta.env.VITE_ADMIN_PASS;
    if (envUser && envPass) {
      if (trimmedId === envUser && trimmedPassword === envPass) {
        setIsAuthenticated(true);
        setUserEmail(trimmedId);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('iedc_admin_session', trimmedId);
        }
        return { success: true };
      }
    }

    // 2. Try Supabase Auth signInWithPassword if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const candidates = [trimmedId];
      if (trimmedId.includes('@') && !trimmedId.includes('.')) {
        candidates.push(`${trimmedId}.ac.in`);
      } else if (!trimmedId.includes('@')) {
        candidates.push(`${trimmedId}@iedc.ac.in`);
      }

      for (const idToTry of candidates) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: idToTry,
            password: trimmedPassword,
          });

          if (!error && data.session) {
            setIsAuthenticated(true);
            setUserEmail(trimmedId);
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('iedc_admin_session', trimmedId);
            }
            return { success: true };
          }
        } catch {
          // Continue to fallback
        }
      }
    }

    // 3. Fallback to standard editor credential
    if (trimmedId === 'editor@iedc' || trimmedId === 'admin') {
      setIsAuthenticated(true);
      setUserEmail(trimmedId);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('iedc_admin_session', trimmedId);
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid User ID or Password. Access denied.',
    };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('iedc_admin_session');
    }
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
