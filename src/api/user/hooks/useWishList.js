import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishListService } from "../services/wishListService";

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishListService.addToWishlist,
    onSuccess: () => {
      // refresh wishlist automatically
      queryClient.invalidateQueries(["wishlist"]);
    },
  });
};

export const useSyncWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishListService.syncWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });
};

export const useGetWishlist = (options = {}) => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishListService.getWishlist,
    staleTime: 60 * 1000,
    enabled: options.enabled,
  });
};

export const useDeleteWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishListService.deleteFromWishlist,
    onSuccess: () => {
      // refresh wishlist automatically
      queryClient.invalidateQueries(["wishlist"]);
    },
  });
}
