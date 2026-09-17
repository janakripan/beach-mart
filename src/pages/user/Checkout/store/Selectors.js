// selectors.js
import { shallow } from 'zustand/shallow';
import { useCheckoutStore } from './CheckoutStore';
import { STEPS } from './constants';

export const useCurrentStep = () =>
  useCheckoutStore((s) => s.currentStep);

export const useCompletedSteps = () =>
  useCheckoutStore((s) => s.completedSteps);

export const useCheckoutCart = () =>
  useCheckoutStore((s) => s.cart);

export const useCheckoutData = () =>
  useCheckoutStore((s) => s.stepData);

// export const useRemainingSteps = () =>
//   useCheckoutStore((s) => STEPS.slice(s.currentStep));

export const useRemainingSteps = () => {
  const currentStep = useCheckoutStore((s) => s.currentStep);
  return STEPS.slice(currentStep + 1);
};
