import apiClient from "../../apiClient";

export const authService = {
  getAuthenticated: async () => {
    const res = await apiClient.get("/7763/getAuthenticated", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GET_AUTH_TOKEN}`,
        url: "https://beachmarts.com/beachmart",
      },
    });
    return res.data;
  },

  adminLogin: async (payload) => {
    const res = await apiClient.post(
      "/7763/clientAuthentication",
      {},
      {
        headers: {
          userid: payload.email,
          password: payload.password,
          url: "https://beachmarts.com/beachmart",
        },
      },
    );
    return res.data;
  },
};
