import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '../services/api';
import { getPendingCount, processQueue } from '../services/syncQueue';
import { toast } from 'sonner';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnline: boolean;
  pendingSync: number;
  isSyncing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshPendingCount: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingSync(count);
    } catch {
      // IndexedDB may not be available
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (isSyncing || !navigator.onLine) return;
    const count = await getPendingCount();
    if (count === 0) return;

    setIsSyncing(true);
    toast.info('Sincronizando cambios...');
    try {
      const { success, failed } = await processQueue();
      if (success > 0) toast.success(`${success} cambio(s) sincronizado(s)`);
      if (failed > 0) toast.error(`${failed} cambio(s) fallaron al sincronizar`);
    } catch {
      toast.error('Error al sincronizar');
    } finally {
      setIsSyncing(false);
      await refreshPendingCount();
    }
  }, [isSyncing, refreshPendingCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      syncNow();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncNow]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.me()
        .then((userData) => {
          setUser(userData);
          refreshPendingCount();
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshPendingCount]);

  const login = async (email: string, password: string) => {
    const { access_token } = await api.login({ email, password });
    localStorage.setItem('token', access_token);
    const userData = await api.me();
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const { access_token } = await api.register({ name, email, password });
    localStorage.setItem('token', access_token);
    const userData = await api.me();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isOnline, pendingSync, isSyncing, login, register, logout, refreshPendingCount, syncNow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
