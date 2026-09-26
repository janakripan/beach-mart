// src/pages/Auth/store/AuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "../../user/Cart/store/CartStore";
import { useCheckoutStore } from "../../user/Checkout/store/CheckoutStore";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      /* ================== STATE ================== */
      accessToken: null,
      refreshToken: null,
      refreshTokenExpiry: null,
      user: null,
      

      /* ================== ACTIONS ================== */

      // Called after successful login / signup
      loginSuccess: (accessToken, refreshToken, refreshTokenExpiry, user) => {
        set({
          accessToken,
          refreshToken,
          refreshTokenExpiry,
          user,
          
        });
      },

      // Optional: update only user (ex: profile refresh)
      setUser: (user) => {
        set({ user });
      },

      // Logout everywhere
      logout: async () => {
        useCartStore.getState().clearCart();
        useCheckoutStore.getState().resetCheckout();
        
        sessionStorage.clear(); // Ensure session storage is cleared

        // Clear tokens first
        set({
          accessToken: null,
          refreshToken: null,
          refreshTokenExpiry: null,
          user: null,
        });
        
        // Fetch anonymous token for API calls
        try {
          const { authService } = await import("../../../api/user/services/authService");
          const response = await authService.getAuthenticated();
          if (response.isSucess && response.data?._accessToken) {
            set({ accessToken: response.data._accessToken });
          }
        } catch (error) {
          console.error("Failed to fetch anonymous token on logout", error);
        }
      },

      /* ================== DERIVED HELPERS ================== */
      // ❗ Not stored — computed when needed
      isAuthenticated: () => Boolean(get().user),
      hasToken: () => Boolean(get().accessToken),
    }),
    {
      name: "auth-storage",

      // Only persist what is needed across refresh
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        refreshTokenExpiry: state.refreshTokenExpiry,
        user: state.user,
      }),
    }
  )
);
