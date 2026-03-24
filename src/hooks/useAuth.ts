'use client';

import { useState, useEffect } from 'react';
import AuthService, { type User } from '@/lib/authService';

interface AuthState {
  user: User | null;
  userRole: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

// Helper to set auth cookie (readable by middleware)
function setAuthCookie(user: User) {
  const cookieData = JSON.stringify({ id: user.id, role: user.role, email: user.email });
  document.cookie = `auth-user=${encodeURIComponent(cookieData)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

// Helper to clear auth cookie
function clearAuthCookie() {
  document.cookie = 'auth-user=; path=/; max-age=0; SameSite=Lax';
}

export function useAuth(): AuthState & AuthActions {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userRole: null,
    isAuthenticated: false,
    loading: true
  });

  // Check authentication state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    try {
      // Check if we're in the browser environment
      if (typeof window === 'undefined') {
        setAuthState({
          user: null,
          userRole: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      const storedUser = localStorage.getItem('user');
      const storedAuth = localStorage.getItem('isAuthenticated');

      if (storedUser && storedAuth === 'true') {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          userRole: user.role,
          isAuthenticated: true,
          loading: false
        });
      } else {
        setAuthState({
          user: null,
          userRole: null,
          isAuthenticated: false,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        user: null,
        userRole: null,
        isAuthenticated: false,
        loading: false
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);

      if (result.success && result.user) {
        // Store user data in localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('isAuthenticated', 'true');
          setAuthCookie(result.user);
        }

        setAuthState({
          user: result.user,
          userRole: result.user.role,
          isAuthenticated: true,
          loading: false
        });

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (data: any) => {
    try {
      const result = await AuthService.register(data);

      if (result.success && result.user) {
        // Store user data in localStorage (only in browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('isAuthenticated', 'true');
          setAuthCookie(result.user);
        }

        setAuthState({
          user: result.user,
          userRole: result.user.role,
          isAuthenticated: true,
          loading: false
        });

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = () => {
    // Clear localStorage and cookie (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      clearAuthCookie();
    }

    // Reset state
    setAuthState({
      user: null,
      userRole: null,
      isAuthenticated: false,
      loading: false
    });
  };

  return {
    ...authState,
    login,
    register,
    signOut
  };
}
