// useCheckoutActions.js
import { useCheckoutStore } from './CheckoutStore';

export const useCheckoutActions = () => {
  const completeStep = useCheckoutStore((s) => s.completeStep);
  const goToStep = useCheckoutStore((s) => s.goToStep);
  const updateCart = useCheckoutStore((s) => s.updateCart);
  const setLoading = useCheckoutStore((s) => s.setLoading);
  const setError = useCheckoutStore((s) => s.setError);
  const clearError = useCheckoutStore((s) => s.clearError);
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  return {
    completeStep,
    goToStep,
    updateCart,
    setLoading,
    setError,
    clearError,
    resetCheckout,
  };
};
