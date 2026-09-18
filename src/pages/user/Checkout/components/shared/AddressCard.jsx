import React, { useEffect, useMemo, useRef, useState } from "react";
import AddressForm from "./AddressForm";
import { useCheckoutActions } from "../../store/useCheckoutActions";
import { useAddresses } from "../../../../../api/user/hooks/useAddress";
import { normalizeAddress } from "../../../../../utils/normalizeAddress";
import { useCheckoutStore } from "../../store/CheckoutStore";
import DotWaveLoader from "../../../../../components/admin/DotWaveLoader";
import { useAuthStore } from "../../../../Auth/store/AuthStore";

const AddressCard = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { completeStep } = useCheckoutActions();

  const user = useAuthStore((s) => s.user);
  const isGuest = user?.isGuest === true;
  const userId = user?.UserId;

  const shouldFetchAddresses = !isGuest && Boolean(userId);

  const { data: rawAddresses = [], isLoading } = useAddresses(
    shouldFetchAddresses ? userId : null,
    { enabled: shouldFetchAddresses }
  );

  const addressListRef = useRef(null);

  const addresses = useMemo(
    () => rawAddresses.map(normalizeAddress),
    [rawAddresses]
  );

  const savedAddress = useCheckoutStore((s) => s.stepData.address);

  /* ===============================
     AUTO SELECTION (LOGGED-IN)
     =============================== */
  useEffect(() => {
    if (isGuest) return;

    if (selectedAddress) return;

    if (savedAddress?.addressId) {
      setSelectedAddress(savedAddress.addressId);
      return;
    }

    if (!addresses.length) return;

    if (addresses.length === 1) {
      setSelectedAddress(addresses[0].id);
      return;
    }

    const defaultAddress = addresses.find((a) => a.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
    }
  }, [addresses, savedAddress, isGuest]);

  /* ===============================
     AUTO SHOW FORM (GUEST / NO ADDR)
     =============================== */
  useEffect(() => {
    if (isGuest) {
      setShowAddForm(true);
      return;
    }

    if (!isLoading && addresses.length === 0) {
      setShowAddForm(true);
    }
  }, [isGuest, isLoading, addresses.length]);

  /* ===============================
     CONFIRM HANDLER (LOGGED-IN)
     =============================== */
  /* ===============================
     CONFIRM HANDLER (LOGGED-IN)
     =============================== */
  const handleConfirm = (address) => {
    completeStep({
      addressId: address.id,
      addressData: null, // 👈 IMPORTANT
      addressSnapshot: address.rawDetails,
    });
  };

  /* ===============================
     FORM CLOSE HANDLER
     =============================== */
  const closeForm = ({ addressData, addressId }) => {
    setShowAddForm(false);

    // GUEST USER: Complete step with address data
    if (isGuest) {
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
    } else {
      // LOGGED-IN USER: Auto-complete step with newly added address
      if (addressId) {
        // Find the newly added address from the list
        const newAddress = addresses.find(addr => addr.id === addressId);

        if (newAddress) {
          // Automatically complete the step with this address
          completeStep({
            addressId: newAddress.id,
            addressData: null,
            addressSnapshot: newAddress.rawDetails,
          });
        } else {
          // Fallback: just select it (address might not be in list yet due to cache)
          setSelectedAddress(addressId);
        }
      }
    }

    requestAnimationFrame(() => {
      addressListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (isLoading && !isGuest) {
    return (
      <div className="p-4 flex justify-center">
        <DotWaveLoader />
      </div>
    );
  }

  return (
    <div ref={addressListRef}>
      {/* LOGGED-IN USER ADDRESS LIST */}
      {!isGuest && (
        <div className="space-y-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-300"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setSelectedAddress(address.id)}
                  className="mt-1"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${selectedAddress === address.id
                      ? "border-primary"
                      : "border-gray-300"
                      } flex items-center justify-center`}
                  >
                    {selectedAddress === address.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                </button>

                <div className="flex-1">
                  <h3 className="font-semibold">{address.name}</h3>
                  <p className="text-sm text-gray-600">{address.address}</p>
                </div>
              </div>

              {selectedAddress === address.id && (
                  <button
                  onClick={() => handleConfirm(address)}
                  className="w-full mt-3 py-2 bg-primary hover:bg-secondary transition text-white rounded-xl"
                >
                  Confirm With This Address
                </button>
              )}
            </div>
          ))}

          {/* Add New Address Button */}
          <div className=" ">
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                + Add New Address
              </button>
            )}
          </div>
        </div>
      )}

      {/* ADDRESS FORM */}
      {showAddForm && <AddressForm closeForm={closeForm} />}
    </div>
  );
};

export default AddressCard;
