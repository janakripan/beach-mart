import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
const Logo = "/logo-big.svg";
import { useSignUp } from '../../../api/user/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useMessage } from '../../../components/admin/MessageBox/useMessage';

// Validation Schema
const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Input Numbers only')
    .required('Phone number is required'),
  passwordHash: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    // )
    .required('Password is required'),
  // confirmPassword: Yup.string()
  //   .oneOf([Yup.ref('passwordHash'), null], 'Passwords must match')
  //   .required('Confirm password is required')
});

const SignupForm = () => {
  const { mutateAsync: signupMutation, isPending, isError, error } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()
  const message = useMessage();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = values;

      await signupMutation(signupData);
      message.success("Account created successfully!");
      navigate('/signin')
      // Success - reset form
      resetForm();
    } catch (err) {
      // Error handling
      console.error('Signup error:', err);
      message.error(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="w-full h-full flex items-center justify-center  bg-white px-8 py-12 overflow-y-auto">
      <div className="w-full max-w-md border border-[#0000001A] rounded-2xl p-10">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-lg">
            <img src={Logo} alt="dc-logo" className='h-full w-full object-contain' />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium text-[#121212] mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 text-sm">
            Fill the fields below to signup
          </p>
        </div>

        <Formik
          initialValues={{
            fullName: '',
            email: '',
            phoneNumber: '',
            passwordHash: '',
            // confirmPassword: ''
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 border rounded-[12px] text-sm focus:outline-none transition-all bg-white hover:bg-[#F8FCF8] focus:bg-[#F8FCF8] focus:shadow-sm ${errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-200 hover:border-[#E3F0E2] focus:border-primary'}`}
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full px-4 py-3 border rounded-[12px] text-sm focus:outline-none transition-all bg-white hover:bg-[#F8FCF8] focus:bg-[#F8FCF8] focus:shadow-sm ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200 hover:border-[#E3F0E2] focus:border-primary'}`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className={`w-full px-4 py-2 border rounded-[12px] text-sm  focus:outline-none  transition-all ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="passwordHash" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="passwordHash"
                    name="passwordHash"
                    placeholder="Password"
                    className={`w-full px-4 py-2 pr-10 border rounded-[12px] text-sm  focus:outline-none  transition-all ${errors.passwordHash && touched.passwordHash ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="passwordHash"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Confirm Password Field */}
              {/* <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`w-full px-4 py-2 pr-10 border rounded-[12px] text-sm  focus:outline-none  transition-all ${
                      errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"                    // ← Most important change
                disabled={isSubmitting || isPending}
                className="w-full bg-primary text-white py-2 rounded-[12px] font-roboto font-medium hover:bg-[#126442]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isPending ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to={"/signin"} className="text-[#CB983F] hover:text-orange-500 font-medium cursor-pointer">
                  Login Here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupForm;
