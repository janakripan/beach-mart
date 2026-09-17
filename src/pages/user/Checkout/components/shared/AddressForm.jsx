import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAddAddress } from "../../../../api/hooks/useAddress";
import { useAuthStore } from "../../../Auth/store/AuthStore";
import { useMessage } from "../../../../components/MessageBox/useMessage";


/* ===================== VALIDATION ===================== */
const validationSchema = Yup.object({
  userName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Invalid phone number"),
  pinCode: Yup.string()
    .required("Pincode is required")
    .matches(/^[0-9]+$/, "Invalid pincode"),
  address: Yup.string().required("Address is required"),
  district: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
});

/* ===================== COMPONENT ===================== */
const AddressForm = ({ closeForm }) => {
  const { mutateAsync: addAddress, isPending } = useAddAddress();
  const user = useAuthStore((s) => s.user);
  const isGuest = user?.isGuest === true;
  const message = useMessage();

  const initialValues = {
    userName: "",
    email: "",
    phoneNumber: "",
    pinCode: "",
    address: "",
    district: "",
    city: "",
    addressLabel: "",
    landmark: "",
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      /* ---------- BUILD SNAPSHOT (COMMON) ---------- */
      const addressData = {
        name: values.userName,
        email: values.email,
        phone: values.phoneNumber,
        address: values.address,
        district: values.district,
        city: values.city,
        pincode: values.pinCode,
        landmark: values.landmark || "",
        addressLabel: values.addressLabel || "",
      };

      /* ---------- GUEST FLOW ---------- */
      if (isGuest) {
        closeForm({
          addressId: -1,
          addressData,
        });
        message.success("Address confirmed!");
        return;
      }

      /* ---------- AUTH USER FLOW ---------- */
      const res = await addAddress(values);
      message.success("Address added successfully!");

      closeForm({
        addressId: res?.data?.addressId,
        addressData: null,
      });
    } catch (err) {
      console.error("Address save failed", err);
      message.error(err?.response?.data?.message || "Failed to add address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="w-full max-w-2xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, handleSubmit }) => (
          <div className="space-y-6 bg-white rounded-2xl  shadow-lg p-8 border border-gray-300">
            {/* Delivery Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Delivery details</h2>
              <p className="text-sm text-gray-500 mb-6">We will delivery your order to the below address</p>

              {/* Full Name */}
              <div className="mb-4">
                <Field
                  name="userName"
                  type="text"
                  placeholder="Full name*"
                  className={`w-full px-4 py-2 bg-gray-50 border  placeholder:text-sm rounded-lg focus:outline-none  transition ${errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-200'
                    }`}
                />
                <ErrorMessage
                  name="userName"
                  component="div"
                  className="mt-1 text-sm text-red-500 flex items-center gap-1"
                />
              </div>

              <div className="mb-4">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email address*"
                  className={`w-full px-4 py-2 bg-gray-50 border rounded-lg ${errors.email && touched.email ? "border-red-500" : "border-gray-200"
                    }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Phone Number and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone number*"
                    className={`w-full px-4 py-2 bg-gray-50  placeholder:text-sm border rounded-lg focus:outline-none  transition ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : 'border-gray-200'
                      }`}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="mt-1 text-sm text-red-500 flex items-center gap-1"
                  />
                </div>
                <div>
                  <Field
                    name="pinCode"
                    type="text"
                    placeholder="Pincode*"
                    maxLength="6"
                    className={`w-full px-4 py-2 bg-gray-50  placeholder:text-sm border rounded-lg focus:outline-none  transition ${errors.pinCode && touched.pinCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                  />
                  <ErrorMessage
                    name="pinCode"
                    component="div"
                    className="mt-1 text-sm text-red-500 flex items-center gap-1"
                  />
                </div>
              </div>

              {/* House Number and Road Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Field
                    name="address"
                    type="text"
                    placeholder="address*"
                    className={`w-full px-4 py-2 bg-gray-50  placeholder:text-sm border rounded-lg focus:outline-none  transition ${errors.address && touched.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
                <div>
                  <Field
                    name="city"
                    type="text"
                    placeholder="City*"
                    className={`w-full px-4 py-2 bg-gray-50 border  placeholder:text-sm rounded-lg focus:outline-none  transition ${errors.city && touched.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>

              {/* City and State */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Field
                    name="district"
                    type="text"
                    placeholder="Street*"
                    className={`w-full px-4 py-2 bg-gray-50  placeholder:text-sm border rounded-lg focus:outline-none  transition ${errors.district && touched.district ? 'border-red-500' : 'border-gray-200'
                      }`}
                  />
                  <ErrorMessage
                    name="district"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
                <div className="mb-4">
                  <Field
                    name="landmark"
                    type="text"
                    placeholder="Landmark"
                    className="w-full px-4 py-2 bg-gray-50 border  placeholder:text-sm border-gray-200 rounded-lg focus:outline-none  transition"
                  />
                </div>

              </div>
              <div className="mb-4">
                <Field
                  name="addressLabel"
                  type="text"
                  placeholder="Address Label (e.g. Home, Work)"
                  className="w-full px-4 py-2 bg-gray-50 border  placeholder:text-sm border-gray-200 rounded-lg focus:outline-none  transition"
                />
                <ErrorMessage
                  name="addressLabel"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>


              {/* Remember Address Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field
                    type="checkbox"
                    name="rememberAddress"
                    className="w-4 h-4 text-black accent-black   border-gray-300 rounded focus:outline-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Remember this address for next time!</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm With this Address'}
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default AddressForm;

