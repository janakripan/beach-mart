import { useMutation } from "@tanstack/react-query";
import { imageService } from "../services/imageService";


export const useImageUpload = () =>
  useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: imageService.uploadImage,
  });
