import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

const LOCAL_ADMIN_STORAGE_KEY = 'tlw_local_admin_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Supabase Auth listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local dev prototype session check
      const localSession = localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
      if (localSession) {
        try {
          const parsed = JSON.parse(localSession);
          setUser(parsed.user);
          setSession(parsed);
        } catch (e) {
          localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      return data;
    }

    // Local dev prototype authentication
    // Default development credentials: admin@thelittlewardrobe.in / admin123
    if (email === 'admin@thelittlewardrobe.in' && password === 'admin123') {
      const mockSession = {
        token: `dev-token-${Date.now()}`,
        user: { email, role: 'authenticated', id: 'dev-admin-id' },
      };
      localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(mockSession));
      setUser(mockSession.user);
      setSession(mockSession);
      return mockSession;
    }

    throw new Error('Invalid email or password. (Dev hint: admin@thelittlewardrobe.in / admin123)');
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    isAuthenticated: Boolean(user),
    isSupabaseConfigured,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
