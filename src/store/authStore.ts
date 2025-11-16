import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (token: string, user: User) => {
    set({ token, user, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));
    }
  },
  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    }
  },
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      }
    }
  },
}));

// Initialize store from localStorage on client side
if (typeof window !== 'undefined') {
  const initializeAuth = () => {
    const token = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('auth-user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        useAuthStore.setState({ token, user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      }
    }
  };
  
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(initializeAuth, 0);
}