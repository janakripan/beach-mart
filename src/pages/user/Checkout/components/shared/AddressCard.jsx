import React from "react";
import AddressForm from "./AddressForm";
import { useCheckoutActions } from "../../store/useCheckoutActions";

const AddressCard = () => {
  const { completeStep } = useCheckoutActions();

  /* ===============================
     FORM CLOSE HANDLER
     =============================== */
  const closeForm = ({ addressData }) => {
    // GUEST USER: Complete step with address data
    completeStep({
      addressId: -1,
      addressSnapshot: {
        UserName: addressData.name,
        Email: addressData.email,
        PhoneNumber: addressData.phone,
        Address: addressData.address,
        City: addressData.city,
        District: addressData.district,
        PinCode: addressData.pincode,
        LandMark: addressData.landmark,
      },
    });
  };

  return (
    <div>
      {/* ADDRESS FORM (Always shown for guest checkout) */}
      <AddressForm closeForm={closeForm} />
    </div>
  );
};

export default AddressCard;
