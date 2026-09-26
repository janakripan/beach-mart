import apiClient from "../../apiClient";
import {
  POST_ECOM_ORDER,
  GET_CUSTOMER_DETAILS,
  GET_DELIVERY_LOCATION,
  GET_DELIVERY_MODES,
  GET_PAYMENT_MODES,
  GET_ORDERS,
} from "../../admin/endpoint";

export const OrderService = {
  postOrder: async (payload) => {
    if (!payload) {
      throw new Error("Order payload is required");
    }
    const response = await apiClient.post(POST_ECOM_ORDER, payload);
    return response.data;
  },

  getCustomerDetailsByMobileNo: async (mobileNo) => {
    if (!mobileNo) return null;
    const response = await apiClient.get(GET_CUSTOMER_DETAILS, {
      headers: { mobileno: mobileNo },
    });
    return response.data?.data || response.data || [];
  },

  getDeliveryLocations: async () => {
    const response = await apiClient.get(GET_DELIVERY_LOCATION);
    return (
      response.data?.data || (Array.isArray(response.data) ? response.data : [])
    );
  },

  getDeliveryModes: async () => {
    const response = await apiClient.get(GET_DELIVERY_MODES);
    return (
      response.data?.data || (Array.isArray(response.data) ? response.data : [])
    );
  },

  getPaymentModes: async () => {
    const response = await apiClient.get(GET_PAYMENT_MODES);
    return (
      response.data?.data || (Array.isArray(response.data) ? response.data : [])
    );
  },

  
};
