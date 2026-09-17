import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useAddAddress, useUpdateAddress } from "../../../../api/user/hooks/useAddress";


const AddressForm = ({ closeForm, editingAddress  }) => {
  const { mutateAsync: addAddress, isPending } = useAddAddress();
    const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress();

  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("Full name is required")
      .min(2, "Full name must be at least 2 characters"),

    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Invalid phone number"),

    pinCode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]+$/, "Invalid pincode"),

    address: Yup.string().required("Address is required"),

    district: Yup.string().required("Street is required"),

    city: Yup.string().required("City is required"),

    addressLabel: Yup.string().required("Address label is required"),

    landMark: Yup.string(),
  });

  /* ================= INITIAL VALUES ================= */
const initialValues = editingAddress
  ? {
      userName: editingAddress.rawDetails.UserName,
      phoneNumber: editingAddress.rawDetails.PhoneNumber,
      pinCode: editingAddress.rawDetails.PinCode,
      address: editingAddress.rawDetails.Address,
      district: editingAddress.rawDetails.District,
      city: editingAddress.rawDetails.City,
      addressLabel: editingAddress.rawDetails.AddressLabel,
      landMark: editingAddress.rawDetails.LandMark || "",
    }
  : {
      userName: "",
      phoneNumber: "",
      pinCode: "",
      address: "",
      district: "",
      city: "",
      addressLabel: "Home",
      landMark: "",
    };


  /* ================= SUBMIT ================= */
const handleSubmit = async (values, { setSubmitting }) => {
  try {
    if (editingAddress) {
      await updateAddress({
        addressId: editingAddress.id,
        data: values,
      });
    } else {
      await addAddress(values);
    }

    closeForm();
  } catch (err) {
    console.error("Address save failed", err);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl font-arial w-full max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[clamp(1.25rem,2vw,2rem)] font-arial font-semibold text-gray-900">
          Delivery details
        </h2>
        <p className="text-sm text-gray-500">
          We will deliver your order to the address below
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">

            {/* Full Name */}
            <div>
              <Field
                name="userName"
                placeholder="Full name*"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                           text-gray-900 placeholder-gray-400 
                           focus:outline-none "
              />
              <ErrorMessage
                name="userName"
                component="div"
                className="text-red-500 text-xs mt-1 ml-1"
              />
            </div>

            {/* Phone + Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Field
                  name="phoneNumber"
                  placeholder="Phone number*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                             focus:outline-none "
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1 ml-1"
                />
              </div>

              <div>
                <Field
                  name="pinCode"
                  placeholder="Pincode*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                             focus:outline-none "
                />
                <ErrorMessage
                  name="pinCode"
                  component="div"
                  className="text-red-500 text-xs mt-1 ml-1"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
              <Field
                name="address"
                placeholder="House / Street / Area*"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                           focus:outline-none "
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-xs mt-1 ml-1"
              />
            </div>
            <div>
              <Field
                as="select"
                name="addressLabel"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                           text-gray-900 cursor-pointer
                           focus:outline-none "
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage
                name="addressLabel"
                component="div"
                className="text-red-500 text-xs mt-1 ml-1"
              />
            </div>
            </div>

            {/* City + District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Field
                  name="city"
                  placeholder="City*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                             focus:outline-none "
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-xs mt-1 ml-1"
                />
              </div>

              <div>
                <Field
                  name="district"
                  placeholder="Street*"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                             focus:outline-none "
                />
                <ErrorMessage
                  name="district"
                  component="div"
                  className="text-red-500 text-xs mt-1 ml-1"
                />
              </div>
            </div>

            {/* Address Label */}
            

            {/* Landmark */}
            <div>
              <Field
                name="landMark"
                placeholder="Landmark (optional)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                           focus:outline-none "
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="w-full bg-primary text-white hover:bg-[#126442]/90 py-3 rounded-lg font-medium 
                                hover:bg-gray-800 transition
                                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isSubmitting || isPending
                        ? editingAddress
                        ? "Updating..."
                        : "Saving..."
                        : editingAddress
                        ? "Update Address"
                        : "Add Address"}
                    </button>

              <button
                type="button"
                onClick={closeForm}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium 
                           hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddressForm;
