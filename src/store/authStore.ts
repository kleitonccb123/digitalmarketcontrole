import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  userName: string;
  role: 'ADMIN' | 'GESTOR' | 'ANALISTA';
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userName: string, code: string) => boolean;
  logout: () => void;
  initialize: () => void;
}

// Códigos de acesso hardcoded
const ACCESS_CODES = {
  ADMIN: ['X7kP9mQ2vL', 'R4tY6hJ8nB', 'W9pL2mK5jH'],
  GESTOR: ['Q3vB6nM8yT', 'Z1xC4rF7jK', 'P5hN8mL2kJ'],
  ANALISTA: ['Y2bV6tR9jH', 'M3nB5vC8xL', 'K7jH9pL2mN', 'T4rF6yB8nM', 'J9kL2mP']
};

const validateCode = (code: string): 'ADMIN' | 'GESTOR' | 'ANALISTA' | null => {
  for (const [role, codes] of Object.entries(ACCESS_CODES)) {
    if (codes.includes(code)) {
      return role as 'ADMIN' | 'GESTOR' | 'ANALISTA';
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      initialize: () => {
        // Inicialização segura do store
        const state = get();
        if (state.user && state.user.userName) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isAuthenticated: false, isLoading: false, user: null });
        }
      },
      login: (userName: string, code: string) => {
        const role = validateCode(code);
        if (role) {
          const user: User = {
            userName: userName.trim(),
            role,
            lastLogin: new Date().toISOString()
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false })
    }),
    {
      name: 'dm-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Garantir estado válido após rehydration
        if (state) {
          if (!state.user || !state.user.userName) {
            state.isAuthenticated = false;
            state.user = null;
          }
          state.isLoading = false;
        }
      }
    }
  )
);