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
      logout: () => {
        useCartStore.getState().clearCart();
        useCheckoutStore.getState().resetCheckout();
        set({
          accessToken: null,
          refreshToken: null,
          refreshTokenExpiry: null,
          user: null,
          
        });
        
      },

      /* ================== DERIVED HELPERS ================== */
      // ❗ Not stored — computed when needed
      isAuthenticated: () => Boolean(get().accessToken),
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
