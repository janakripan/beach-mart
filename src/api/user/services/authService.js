
import apiClient from "../../apiClient";

export const authService = {
  login: async (payload) => {
    const res = await apiClient.post("/oauth/", payload);
    const data = res.data.data;

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      refreshTokenExpiry: data.refreshTokenExpiry,
      user: data.userInfo?.[0],
    };
  },

  googleLogin: async (payload) => {
    const res = await apiClient.post("/google-auth/", payload);
    const data = res.data.data;

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      refreshTokenExpiry: data.refreshTokenExpiry,
      user: data.userInfo,
    };
  },

  signup: async (payload) => {
    const res = await apiClient.post("/postUserMaster/", payload);
    return res.data.data;
  },

  guestlogin: async () => {
    const res = await apiClient.post('/oauth/guest/');
    return res.data.data
  }
};

