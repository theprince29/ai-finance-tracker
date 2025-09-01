import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (code: string) => {
        try {
          const response = await api.post('/auth/google', { code });
          const { user, token } = response.data;
          set({ user, isAuthenticated: true, token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error(error);
        }
      },

      logout: async () => {
        await api.post('/auth/logout');
        set({ user: null, isAuthenticated: false, token: null });
        delete api.defaults.headers.common['Authorization'];
      },

      fetchProfile: async () => {
        try {
          const response = await api.get('/auth/profile');
          set({ user: response.data });
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

export default useAuthStore;
