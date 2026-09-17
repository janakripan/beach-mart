import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";


export const useGetReviews = (productId) => {
    return useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => reviewService.getReviews(productId),
    });
};

export const usePostReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reviewService.postReview,
        onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
            queryKey: ["reviews", variables.productId],
        });
        queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    });
}
