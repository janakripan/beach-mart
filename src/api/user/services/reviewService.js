import apiClient from "../../apiClient";

export const reviewService = {
  /* ---------------- GET REVIEWS ---------------- */
  getReviews: async (productId) => {
    if (!productId) {
      throw new Error("productId is required");
    }
    const res = await apiClient.get("/getReview/", {
      headers: {
        ProductId: productId,
      },
    });
    return res.data.data;
  },

    /* ---------------- POST REVIEW ---------------- */
  postReview: async (payload) => {
    if (!payload.productId) {
      throw new Error("productId is required");
    }
    const res = await apiClient.post("/postReview/", payload);
    return res.data.data;
  },
};
