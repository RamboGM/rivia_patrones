import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  plan: 'free',
  loading: true,
  setUser: (user) => set({ user, plan: user?.plan || 'free' }),
  clearUser: () => set({ user: null, plan: 'free' }),
  setLoading: (loading) => set({ loading }),
}));

export default useUserStore;
