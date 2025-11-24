import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('auth_token'),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    
    set({ token: data.token, user: data.user });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ token: null, user: null });
  }
}));