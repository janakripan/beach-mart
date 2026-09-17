// useAuth.js
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "../../../pages/Auth/store/AuthStore";

export function useLogin() {
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ accessToken, refreshToken, refreshTokenExpiry, user }) => {
      loginSuccess(
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        user
      );
    },
  });
}

export function useGLogin() {
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  return useMutation({
    mutationFn: authService.googleLogin,
    
    onSuccess: ({ accessToken, refreshToken, refreshTokenExpiry, user }) => {
      loginSuccess(
        accessToken,
        refreshToken,
        refreshTokenExpiry,
        user
      );
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: authService.signup,
  });
}

export function useGuestLogin(){
  return useMutation({
    mutationFn: authService.guestlogin,
  })
}
