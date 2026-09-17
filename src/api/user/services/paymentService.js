// src/api/services/paymentService.js
import apiClient from "../../apiClient";

export const paymentService = {
  createCheckoutSession: async () => {
    const { data } = await apiClient.post(
      "/Payment/create-checkout-session",
      {},
      {
        headers: {
          paymode: "stripe",
        },
      }
    );

    return data;
  },

    buyNowPayment: async ({ productId, variantId, quantity, paymode }) => {
    const { data } = await apiClient.post(
      "/Payment/buy-now",
      {
        productId,
        variantId,
        quantity,
      },
      {
        headers: {
          paymode,
        },
      }
    );
    return data;
  },
};
