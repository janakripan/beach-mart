// src/pages/Cart/store/CartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useCartStore = create(
  persist(
    immer((set, get) => ({
      items: [],
      summary: {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
      },

      _recalculate: () => {
        const items = Array.isArray(get().items) ? get().items : [];

        const subtotal = items.reduce(
          (sum, item) => sum + Number(item.price) * item.qty,
          0
        );

        const originalSubtotal = items.reduce(
          (sum, item) =>
            sum + Number(item.originalPrice || item.price) * item.qty,
          0
        );

        const discount = originalSubtotal - subtotal;

        // const tax = subtotal * 0.05;
        // const shipping = subtotal > 500 ? 0 : 50;
        const tax = 0;
        const shipping = 0;


        set((state) => {
          state.summary = {
            subtotal,
            tax,
            shipping,
            discount,
            total: subtotal + tax + shipping,
          }
        });
      },

      setCart: (cart) => {
        set((state) => {
          state.items = Array.isArray(cart?.items) ? cart.items : [];
        });
        get()._recalculate();
      },

      clearCart: () => {
        set({
          items: [],
          summary: {
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: 0,
          },
        });
      },
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            i => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existing) {
            existing.qty += item.qty;
          } else {
            state.items.push(item);
          }
        });
        get()._recalculate();
      },

      increaseQty: (productId, variantId) => {
        set((state) => {
          const item = state.items.find(
            i => i.productId === productId && i.variantId === variantId
          );
          if (item && item.qty < item.stockQty) {
            item.qty += 1;
          }
        });
        get()._recalculate();
      },

      decreaseQty: (productId, variantId) => {
        set((state) => {
          const item = state.items.find(
            i => i.productId === productId && i.variantId === variantId
          );
          if (!item) return;

          if (item.qty === 1) {
            state.items = state.items.filter(
              i => i.productId !== productId || i.variantId !== variantId
            );
          } else {
            item.qty -= 1;
          }
        });
        get()._recalculate();
      },

      removeItemLocal: (productId, variantId) => {
        set((state) => {
          state.items = state.items.filter(
            i => i.productId !== productId || i.variantId !== variantId
          );
        });
        get()._recalculate();
      },
    })),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        summary: state.summary,
      }),
    }
  )
);
