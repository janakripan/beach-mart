
import apiClient from "../../apiClient";

export const OrderService = {
  postOrder: async (payload) => {
    if (!payload) {
      throw new Error("Order payload is required");
    }

    const response = await apiClient.post("/postOrders", payload);
    
    return response.data;
  },

  getOrders: async ({
    isAdmin,
    pageNo,
    pageSize,
    fromDate,
    toDate,
    email,
    orderID,
    orderStatus,
    userId
  } = {}) => {

    const headers = {};

    if (isAdmin !== undefined) headers.isAdmin = isAdmin;
    if (pageNo !== undefined) headers.pageNo = pageNo;
    if (pageSize !== undefined) headers.pagesize = pageSize;
    if (fromDate) headers.fromdate = fromDate;
    if (toDate) headers.todate = toDate;
    if (email) headers.email = email;
    if (orderID) headers.orderID = orderID;
    if (orderStatus) headers.orderStatus = orderStatus;
    if (userId) headers.userId = userId;

    const response = await apiClient.get("/getOrders", {
      headers,
    });
    return response.data;
  },
};


