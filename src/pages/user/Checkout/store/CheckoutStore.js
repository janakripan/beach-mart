// checkoutStore.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { STEPS } from "./constants";

const getStepName = (i) => STEPS[i] ?? null;

export const useCheckoutStore = create(
  persist(
    immer((set, get) => ({

      mode: null, // "cart" | "buy_now"
      items: [],

      setBuyNow: (item) =>
        set((state) => {
          state.mode = "buy_now";
          state.items = [item]; // ✅ flat array
          state.currentStep = 0;
          state.completedSteps = [];
          state.isCompleted = false;
        }),

      setFromCart: (items) =>
        set((state) => {
          state.mode = "cart";
          state.items = items;
        }),


      currentStep: 0,
      isCompleted: false,
      completedSteps: [],
      stepData: {
        // login: null,
        address: null,
        review: null,
        payment: null,
      },

      completeStep: (data) => {
        const step = getStepName(get().currentStep);
        if (!step) return;

        set((state) => {
          state.stepData[step] = data;

          if (!state.completedSteps.includes(state.currentStep)) {
            state.completedSteps.push(state.currentStep);
          }

          state.currentStep += 1;
        });
      },

      goToStep: (step) => {
        if (step < 0 || step > get().completedSteps.length) return false;
        set({ currentStep: step });
        return true;
      },

      markCompleted: () => {
        set({ isCompleted: true });
      },

      resetCheckout: () =>
        set({
          mode: null,
          items: [],
          currentStep: 0,
          completedSteps: [],
          isCompleted: false,
          stepData: {
            address: null,
            review: null,
            payment: null,
          },
        }),
    })),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
