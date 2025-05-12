import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  loginWithEmailAndPassword,
  logout,
  getCurrentUser,
} from "../services/auth.service";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      checkAuth: async () => {
        try {
          const data = await getCurrentUser();
          if (data.user) {
            set({ user: data.user, isAuthenticated: true });
            return data.user;
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ user: null, isAuthenticated: false });
        }
        return null;
      },
      login: async (email, password) => {
        try {
          let data = await loginWithEmailAndPassword(email, password);
          set({ user: data.user, isAuthenticated: true });
          return data.user;
        } catch (error) {
          console.error("Login failed:", error);
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },
      logout: async () => {
        try {
          await logout();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
      rememberMe: false,
      setRememberMe: (value) => set({ rememberMe: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        state.rememberMe
          ? {
              user: state.user,
              isAuthenticated: state.isAuthenticated,
              rememberMe: state.rememberMe,
            }
          : { rememberMe: state.rememberMe },
    }
  )
);

export default useAuthStore;
