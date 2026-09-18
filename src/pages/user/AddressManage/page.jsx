import { useRef, useState } from "react";
import AddressCard from "./components/AddressCard";
import AddressForm from "./components/AddressForm";
import { useAddresses } from "../../../api/user/hooks/useAddress";
import { normalizeAddress } from "../../../utils/normalizeAddress";
import DotWaveLoader from "../../../components/admin/DotWaveLoader";
import AddressCardSkeleton from "./components/AddressCardSkeleton";
import { useAuthStore } from "../../Auth/store/AuthStore";

const SavedAddresses = () => {
  const userId = useAuthStore((s) => s.user?.UserId);
  const { data: addressesData, isLoading, isError } = useAddresses(userId);
  const addresses = addressesData?.map(normalizeAddress) || [];
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const formRef = useRef(null);

  // Disable body scroll when overlay is open
  React.useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showForm]);

const handleAddAddress = () => {
  setEditingAddress(null);
  setShowForm(true);
};

const handleEditAddress = (address) => {
  setEditingAddress(address);
  setShowForm(true);
};
  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 tracking-wider mb-1 font-arial">
            ACCOUNT / ADDRESS MANAGEMENT
          </p>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8 font-arial">
          <div>
            <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] text-gray-900 mb-3">
              Saved Addresses
            </h1>
            <p className="text-sm text-gray-500 tracking-wide">
              MANAGE YOUR DELIVERY LOCATIONS FOR SEAMLESS FRAGRANCE DELIVERY
            </p>
          </div>
          
          <button 
            onClick={handleAddAddress}
            className="bg-primary text-white hover:bg-[#126442]/90 px-6 py-3 text-xs font-medium tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            ADD NEW ADDRESS
          </button>
        </div>

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

  {/* Loading → Skeletons */}
  {isLoading &&
    Array.from({ length: 3 }).map((_, i) => (
      <AddressCardSkeleton key={i} />
    ))
  }

  {/* Empty state */}
  {!isLoading && addresses.length === 0 && (
    <div className="col-span-full text-center py-20 text-gray-500">
      <p className="text-sm tracking-wide">
        You haven’t added any addresses yet.
      </p>
    </div>
  )}

  {/* Data */}
  {!isLoading && addresses.map((address) => (
    <AddressCard
      key={address.id}
      address={address}
      isDefault={address.isDefault}
      onEdit={handleEditAddress}
    />
  ))}

</div>


        {/* Address Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-8">
            <div 
              className="bg-transparent w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-lg"
              ref={formRef}
            >
              <AddressForm closeForm={closeForm} editingAddress={editingAddress}/>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedAddresses;
