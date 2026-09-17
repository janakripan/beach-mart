// src/pages/Cart/api/cartService.js
import apiClient from "../../apiClient";

export const cartService = {
  /* ================= GET CART ================= */
  async getCart() {
    const res = await apiClient.get("/getCart/");
    return res.data.data;
  },

  /* ================= ADD ITEM ================= */
  /* ================= ADD SINGLE ITEM ================= */
  addItem({ productId, variantId, quantity }) {
    return apiClient.post("/postCart/", {
       items: [
      {
        productId,
        variantId,
        quantity,
      },
    ],
    });
  },

  /* ================= ADD MULTIPLE ITEMS (MERGE) ================= */
  addItems(items) {
    if (!items || items.length === 0) return Promise.resolve();
    const payload = items.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.qty || item.quantity
    }));
    return apiClient.post("/postCart/", { items: payload });
  },

  /* ================= UPDATE ITEM ================= */
updateItem({ cartItemId, quantity }) {
  return apiClient.put(
    "/putCart/",
    { quantity },
    {
      headers: {
        CartId: cartItemId,
      },
    }
  );
},


  /* ================= CLEAR CART ================= */
  deleteItem({cartId}) {
    return apiClient.delete("/DeleteCart/",{
      headers: {
        CartId:cartId,
      },
    });
  },

  clearCart() {
    return apiClient.delete("/DeleteUserCart/");
  },
};
