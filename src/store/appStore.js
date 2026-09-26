import { create } from 'zustand';

export const useAppStore = create((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  
  products: [],
  setProducts: (products) => set({ products }),
  
  variants: [],
  setVariants: (variants) => set({ variants }),
  
  banner: null,
  setBanner: (banner) => set({ banner }),
  
  deliveryLocations: [],
  setDeliveryLocations: (deliveryLocations) => set({ deliveryLocations }),
  
  deliveryModes: [],
  setDeliveryModes: (deliveryModes) => set({ deliveryModes }),
  
  paymentModes: [],
  setPaymentModes: (paymentModes) => set({ paymentModes }),
}));
