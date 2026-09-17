import { useQuery, useMutation } from "@tanstack/react-query";
import { OrderService } from "../services/orderService";

export const useGetUserOrders = (filters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => OrderService.getOrders(filters),
  });
};

export const usePostOrder = () => {
  return useMutation({
    mutationFn: OrderService.postOrder,
  })
}
