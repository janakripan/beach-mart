import apiClient from "../../apiClient";

export const wishListService = {
  /* ---------------- ADD TO WISHLIST ---------------- */
  addToWishlist: async ({ ProductId, VariantId }) => {
    if (!ProductId) {
      throw new Error("productId is required");
    }

    const response = await apiClient.post(
      "/postProductWishlist/",
      null,
      {
        headers: {
          ProductId,
          ...(VariantId && { VariantId }),
        },
      }
    );

    return response.data;
  },

  /* ---------------- SYNC WISHLIST ---------------- */
  syncWishlist: async (items) => {
    if (!items || items.length === 0) return;

    const payload = {
      items: items.map(i => ({
        productId: i.productId,
        variantId: i.variantId ?? -1
      }))
    };

    const response = await apiClient.post("/postProductWishlist/", payload);
    return response.data;
  },

  /* ---------------- GET WISHLIST ---------------- */
  getWishlist: async () => {
    const response = await apiClient.get("/getProductWishlist/");
    return response.data.data;
  },

  deleteFromWishlist: async ({ ProductId, varientID }) => {
    if (!ProductId) {
      throw new Error("productId is required");
    }

    const response = await apiClient.delete(
      "/DeleteProductWishlist/",
      {
        headers: {
          ProductId,
          ...(varientID && { varientID }),
        },
      }
    );

    return response.data;
  },
};
