
import { useMutation } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: paymentService.createCheckoutSession,
  });
};

export const useBuyNowPayment = () => {
  return useMutation({
    mutationFn: paymentService.buyNowPayment,
  });
};
