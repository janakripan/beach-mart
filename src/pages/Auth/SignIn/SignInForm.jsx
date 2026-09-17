import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
const Logo = "/logo-big.svg";

import { useGLogin, useLogin } from "../../../api/user/hooks/useAuth";
import { useAuthStore } from "../../Auth/store/AuthStore";
import { useCheckoutStore } from "../../user/Checkout/store/CheckoutStore";
import { useCheckoutActions } from "../../user/Checkout/store/useCheckoutActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useSyncCart } from "../../../api/user/hooks/useCart";
import { useSyncWishlist } from "../../../api/user/hooks/useWishList";
import { useCartStore } from "../../user/Cart/store/CartStore";
import { useMessage } from "../../../components/admin/MessageBox/useMessage";

/* ✅ Validation */
const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(4, "Min 4 characters").required("Password required"),
});

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();

  const { mutateAsync: login, isPending, isError, error } = useLogin();
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);
  const { completeStep } = useCheckoutActions();
  const { mutateAsync: googleLoginMutation } = useGLogin();
  const { mutateAsync: syncGuestCart } = useSyncCart();
  const { mutateAsync: syncWishlist } = useSyncWishlist();
  const location = useLocation();
  const from = location.state?.from || "/";


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      /* 🔐 Authenticate (updates AuthStore internally) */
      /* 🔐 Authenticate (updates AuthStore internally) */
      await login(values);
      message.success("Logged in successfully!");

      /* 🛒 Sync Guest Cart */
      const localCartItems = useCartStore.getState().items;
      if (localCartItems.length > 0) {
        await syncGuestCart(localCartItems);
        useCartStore.getState().clearCart();
      }

      /* ⭐ Sync Guest Wishlist */
      const localWishlistRaw = localStorage.getItem("GUEST_WISHLIST");
      if (localWishlistRaw) {
        const localWishlist = JSON.parse(localWishlistRaw);
        if (localWishlist.length > 0) {
          const payload = localWishlist.map(item => ({
            productId: item.productID || item.productId,
            variantId: item.variantId ?? -1
          }));
          await syncWishlist(payload);
        }
        localStorage.removeItem("GUEST_WISHLIST");
      }

      /* ▶️ Start checkout using AUTH STORE user */
      /* 🚀 Redirect */
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed", err);
      message.error(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="w-full h-full flex items-center justify-center bg-white px-8 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="lg:hidden mb-4 md:mb-8 flex justify-center">
          <img src={Logo} alt="logo" className="h-28 md:h-32 w-auto object-contain" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium">Login</h2>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 border border-[#0000001A] rounded-2xl p-8">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-200 text-sm rounded-[12px] bg-white hover:bg-[#F8FCF8] hover:border-[#E3F0E2] focus:bg-[#F8FCF8] focus:border-primary focus:outline-none focus:shadow-sm transition-all duration-200"
                />
                <div className="mt-1">
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                </div>
              </div>

              {/* Password */}
              <div className="">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative  ">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-200 text-sm rounded-[12px] bg-white hover:bg-[#F8FCF8] hover:border-[#E3F0E2] focus:bg-[#F8FCF8] focus:border-primary focus:outline-none focus:shadow-sm transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 "
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="mt-1">
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full bg-primary text-white hover:bg-[#126442]/90 py-3 rounded-[12px]  disabled:opacity-50"
              >
                {isSubmitting || isPending ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm mt-2 text-gray-600">
          Dont have an account?{' '}
          <Link to={"/signup"} className="text-[#CB983F] hover:text-orange-500 font-medium cursor-pointer">
            Register Here
          </Link>
        </p>
        <div className="w-full h-0.5  bg-[#D8DADC] mt-5  relative font-poppins  ">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-black text-sm">
            Or Register with
          </div>
          <div className="py-5 flex justify-center">
            <GoogleLogin
              onSuccess={async (response) => {
                try {
                  await googleLoginMutation({
                    token: response.credential,
                  });

                  /* 🛒 Sync Guest Cart */
                  const localCartItems = useCartStore.getState().items;
                  if (localCartItems.length > 0) {
                    await syncGuestCart(localCartItems);
                    useCartStore.getState().clearCart();
                  }

                  /* ⭐ Sync Guest Wishlist */
                  const localWishlistRaw = localStorage.getItem("GUEST_WISHLIST");
                  if (localWishlistRaw) {
                    const localWishlist = JSON.parse(localWishlistRaw);
                    if (localWishlist.length > 0) {
                      const payload = localWishlist.map(item => ({
                        productId: item.productID || item.productId,
                        variantId: item.variantId ?? -1
                      }));
                      await syncWishlist(payload);
                    }
                    localStorage.removeItem("GUEST_WISHLIST");
                  }

                  navigate(from, { replace: true });
                } catch (err) {
                  console.error("Google login failed", err);
                }
              }}
              onError={() => {
                console.error("Google Login Failed");
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
