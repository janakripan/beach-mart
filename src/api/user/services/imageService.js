import axios from "axios";
import { IMAGE_UPLOAD_ENDPOINT, IMAGE_DELETE_ENDPOINT } from "../../admin/endpoint";

export const imageService = {
  uploadImage: async ({file, category}) => {
    const formData = new FormData();
    formData.append("imageFiles", file);
    
    const response = await axios.post(
      IMAGE_UPLOAD_ENDPOINT,
      formData,
      {
        headers: {
          clientID: import.meta.env.VITE_CLIENT_ID,
          Token: import.meta.env.VITE_UPLOAD_TOKEN,
          imageClassification: category,
        },
      }
    );
    return response.data;
  },

  deleteImage: async (url) => {
    // Extract the filename from the URL
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const thumbFilename = `thumb_${filename}`;
    
    // Create the request payload
    const payload = {
      fileNames: [filename, thumbFilename],
    };
    
    const response = await axios.delete(IMAGE_DELETE_ENDPOINT, {
      headers: {
        Token: import.meta.env.VITE_UPLOAD_TOKEN,
        clientID: import.meta.env.VITE_CLIENT_ID,
        imageClassification: "dtac",
        "Content-Type": "application/json",
      },
      data: payload,
    });
    
    return response.data;
  }
};
