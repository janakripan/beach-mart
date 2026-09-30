import { create } from 'zustand';

export const useAppStore = create((set) => ({
  categories: null, // null means loading
  setCategories: (categories) => set({ categories }),
  
  homeCategories: null,
  setHomeCategories: (homeCategories) => set({ homeCategories }),
  
  products: null,
  setProducts: (products) => set({ products }),
  
  variants: null,
  setVariants: (variants) => set({ variants }),
  
  banner: null,
  setBanner: (banner) => set({ banner }),
  
  deliveryLocations: null,
  setDeliveryLocations: (deliveryLocations) => set({ deliveryLocations }),
  
  deliveryModes: null,
  setDeliveryModes: (deliveryModes) => set({ deliveryModes }),
  
  paymentModes: null,
  setPaymentModes: (paymentModes) => set({ paymentModes }),
}));
