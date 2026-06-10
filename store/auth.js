'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const emptyUser = { name: null, email: null };

export const useAuthStore = create(
  persist(
    set => ({
      user: emptyUser,
      token: null,
      isLoggedIn: false,
      hydrated: false,
      setHydrated: hydrated => set({ hydrated }),
      setSession: ({ user, token }) =>
        set({ user, token, isLoggedIn: Boolean(token) }),
      updateUser: user => set({ user }),
      clearSession: () =>
        set({ user: emptyUser, token: null, isLoggedIn: false }),
    }),
    {
      name: 'tasteorama-auth',
      partialize: state => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => state => state?.setHydrated(true),
    }
  )
);
