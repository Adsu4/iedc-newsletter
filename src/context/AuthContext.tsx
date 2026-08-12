import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userId: string, password: string): { success: boolean; error?: string } => {
    if (!userId.trim() || !password.trim()) {
      return { success: false, error: 'Please enter both User ID and Password.' };
    }

    const envUser = import.meta.env.VITE_ADMIN_USER;
    const envPass = import.meta.env.VITE_ADMIN_PASS;

    // If env vars are set, validate against them
    if (envUser && envPass) {
      if (userId.trim() === envUser && password.trim() === envPass) {
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials. Access denied.' };
    }

    // Dev fallback: accept any non-empty credentials
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
