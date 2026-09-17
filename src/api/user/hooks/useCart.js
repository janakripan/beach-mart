// src/pages/Cart/api/useCartQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartServices";
import { normalizeCart } from "../../../utils/normalizeCart";
import { useCartStore } from "../../../pages/user/Cart/store/CartStore";

import { useEffect } from "react";
import { useAuthStore } from "../../../pages/Auth/store/AuthStore";


export const useCartQuery = () => {
  const setCart = useCartStore((s) => s.setCart);
  const userId = useAuthStore((s) => s.user?.UserId);
  const query = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const rows = await cartService.getCart();

      return normalizeCart(rows);
    },
    enabled: !!userId,
  });

  const { data } = query;

  useEffect(() => {
    if (data) {
      setCart(data);
    }
  }, [data, setCart]);
  return query;
};

export const useAddToCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.addItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useSyncCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.addItems,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartQty = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.updateItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId }) => cartService.deleteItem({ cartId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
