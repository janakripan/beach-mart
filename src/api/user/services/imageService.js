import { IMAGE_UPLOAD_ENDPOINT } from "../endpoint";

export const imageService = {
 uploadImage : async (file, category) => {
  const formData = new FormData();
  formData.append("imageFiles", file);

  const response = await axios.post(
    IMAGE_UPLOAD_ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        clientID: import.meta.env.VITE_CLIENT_ID,
        Token: import.meta.env.VITE_UPLOAD_TOKEN,
        imageClassification: category,
      },
    }
  );

  return response.data;
}
}

