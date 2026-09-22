import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
const Logo = "/logo-big.svg";

import { useAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

/* ✅ Validation */
const loginSchema = Yup.object({
  email: Yup.string().required("Username is required"),
  password: Yup.string().min(4, "Min 4 characters").required("Password required"),
});

const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMsg("");
    try {
      if (values.email === "admin" && values.password === "admin") {
        loginSuccess("dummy-token", "dummy-refresh", null, { Role: "Admin", name: "Admin" });
        navigate("/admin");
      } else {
        setErrorMsg("Invalid credentials. Please use admin/admin");
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white px-8 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="lg:hidden mb-8 flex justify-center">
          <img src={Logo} alt="logo" className="h-28 md:h-32 w-auto object-contain" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium">Admin Login</h2>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </div>

        {/* API Error */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">
              {errorMsg}
            </p>
          </div>
        )}

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
                  Username <span className="text-red-500">*</span>
                </label>
                <Field
                  name="email"
                  type="text"
                  placeholder="Username (admin)"
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
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-[12px] hover:bg-[#126442]/90 disabled:opacity-50"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>
        
      </div>
    </div>
  );
};

export default AdminLoginForm;
