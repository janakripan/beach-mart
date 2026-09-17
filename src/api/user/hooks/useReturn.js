import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { returnService } from "../services/returnService";

export const usePostReturnProducts = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: returnService.postReturnProducts,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["returnProducts"] });
    },
  });
};

export const useGetReturnProducts = ({ fromDate, toDate }) => {
  return useQuery({
    queryKey: ["returnProducts", fromDate, toDate],
    queryFn: () =>
      returnService.getReturnProducts(fromDate, toDate),
    // 🔥 REMOVE enabled
    select: (res) => res?.data || [],
  });
};

export const useEditReturnStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ returnId, returnStatus }) =>
      returnService.putReturnProducts(returnId, returnStatus),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["returnProducts"] });
    },
  });
};
