import { useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentStep, useCompletedSteps } from "../store/Selectors";
import { useCheckoutActions } from "../store/useCheckoutActions";
import { useAuthStore } from "../../../Auth/store/AuthStore";
import { useCheckoutStore } from "../store/CheckoutStore";

const STEP_ROUTES = {
  // 0: "/checkout/login",
  0: "/checkout/address",
  1: "/checkout/review",
  2: "/checkout/payment",
};

// const ROUTE_TO_STEP = {
//   "/checkout/login": 0,
//   "/checkout/address": 1,
//   "/checkout/review": 2,
//   "/checkout/payment": 3,
// };

const STEP_ROUTES_KEYS = {
  // login: 0,
  address: 0,
  review: 1,
  payment: 2,
};

export const useCheckoutNavigation = () => {
  const navigate = useNavigate();

  const currentStep = useCurrentStep();
  const completedSteps = useCompletedSteps();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const mode = useCheckoutStore((s) => s.mode);
  const items = useCheckoutStore((s) => s.items);

  const { goToStep, resetCheckout } = useCheckoutActions();

  useEffect(() => {
    // ❌ Checkout should not exist
    if (!isAuthenticated || !mode || items.length === 0) {
      resetCheckout();
      navigate("/", { replace: true }); // or /cart
      return;
    }
  }, [isAuthenticated, mode, items.length, resetCheckout, navigate]);
  useEffect(() => {
    if (!mode || items.length === 0) return;
    navigate(STEP_ROUTES[currentStep], { replace: true });
  }, [currentStep, mode, items.length, navigate]);

  // 🔀 Step indicator navigation (STORE ONLY)
  const navigateToStep = useCallback(
    (step) => {
      if (step >= 0 && step <= completedSteps.length) {
        goToStep(step);
        return true;
      }
      return false;
    },
    [completedSteps, goToStep]
  );

  return {
    currentStep,
    completedSteps,
    navigateToStep,
    canGoBack: currentStep > 0,
  };
};
