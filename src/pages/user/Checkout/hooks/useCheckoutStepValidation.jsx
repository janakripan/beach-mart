// src/features/checkout/hooks/useCheckoutStepValidation.js
import { useAuthStore } from "../../Auth/store/AuthStore";
import { useCheckoutStore } from "../store/CheckoutStore";
import { useValidateCart } from "@/api/hooks/useValidateCart"; // React Query hook

export const useCheckoutStepValidation =()=> {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const stepData = useCheckoutStore((s) => s.stepData);
  const cartItems = useCheckoutStore((s) => s.cart.items);

  const {
    mutateAsync: validateCart,
    isLoading: isCheckingBackend,
  } = useValidateCart();

  const canProceed = async (step) => {
    switch (step) {
      case 0:
        // Login → Address
        return isAuthenticated;

      case 1:
        // Address → Review
        return Boolean(
          stepData.address?.selectedAddressId ||
          stepData.address?.newAddressSaved
        );

      case 2:
        // Review → Payment (backend authority)
        const result = await validateCart({ items: cartItems });
        return result?.valid === true;

      case 3:
        // Payment → Order
        return Boolean(stepData.payment?.paymentIntentId);

      default:
        return false;
    }
  };

  return {
    canProceed,
    isChecking: isCheckingBackend,
  };
}
