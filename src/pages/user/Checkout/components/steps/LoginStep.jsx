import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useGoogleLogin } from "@react-oauth/google";
import { useLogin, useGLogin } from "../../../../../api/user/hooks/useAuth";
import { useCheckoutActions } from "../../store/useCheckoutActions";
import { useCheckoutStore } from "../../store/CheckoutStore";
import { useAuthStore } from "../../../../Auth/store/AuthStore";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginStep = () => {
  
    const user = useAuthStore((s) => s.user);
    const resetCheckout = useCheckoutStore((s) => s.resetCheckout);
    const { completeStep } = useCheckoutActions();
  const { mutateAsync: loginMutation } = useLogin();
  const { mutateAsync: googleLoginMutation } = useGLogin();
  

const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    const res = await googleLoginMutation({
      token: tokenResponse.access_token,
    });
    completeStep({ user: res.user });
  },
  onError: () => {
    alert("Google Login Failed");
  },
});

  return (
    <div className="w-full mx-auto space-y-4 bg-white  ">
      
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center">Login</h1>
      <p className="text-sm text-gray-500 text-center mt-1">
        Proceed Login and Complete Order
      </p>

      {/* Google Login */}
      <button 
  onClick={() => googleLogin()}
  className="w-full flex items-center justify-center  gap-3 border border-gray-300 py-3 shadow-md rounded-md hover:bg-gray-50 transition"
>
  <img
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google"
    className="w-5 h-5"
  />
  <span className="text-sm font-medium text-gray-700">
    Sign in with Google
  </span>
</button>


    <div className="border border-gray-200 rounded-xl p-5">
      {/* Email + Password Login */}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
       onSubmit={async (values, { setSubmitting, setStatus }) => {
  try {
    const data = await loginMutation(values);
    // data = { token, user }
      resetCheckout();
      completeStep({ user });

  } catch (err) {
    setStatus("Invalid email or password");
  } finally {
    setSubmitting(false);
  }
}}

      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4 ">

            {/* Email */}
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Enter Your Email address"
                className={`w-full px-4 py-2 rounded-xl border placeholder:text-sm
                  ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              />

              <ErrorMessage
                name="email"
                component="p"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Field
                type="password"
                name="password"
                placeholder="Enter Your Password"
                className={`w-full px-4 py-2 rounded-xl border placeholder:text-sm
                  ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              />

              <ErrorMessage
                name="password"
                component="p"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Footer links */}
      <div className="mt-4 text-center">
        <button className="text-sm text-gray-500 hover:underline">
          Forgot password?
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">New User?</span>{" "}
        <button className="font-medium text-primary hover:underline">
          Click here to create your account!
        </button>
      </div>
    </div>
    </div>
  );
};

export default LoginStep;
