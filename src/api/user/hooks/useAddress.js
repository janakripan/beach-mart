import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../services/addressService";

/* =========================
   GET USER ADDRESSES
========================= */

export const useAddresses = (userId) => {
  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: addressService.getAddresses,
    enabled: !!userId,
    select: (res) => res?.data || [],
  });
};

/* =========================
   ADD ADDRESS
========================= */

export const useAddAddress = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addressService.addAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

/* =========================
   UPDATE ADDRESS
========================= */

export const useUpdateAddress = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addressService.updateAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

/* =========================
   SET DEFAULT ADDRESS
========================= */

export const useSetDefaultAddress = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addressService.setDefaultAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
