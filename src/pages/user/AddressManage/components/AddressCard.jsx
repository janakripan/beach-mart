import { use } from "react";
import { useSetDefaultAddress } from "../../../../api/user/hooks/useAddress";


const AddressCard = ({ address, onEdit  }) => {
  const { id, name, type, address: fullAddress, phone, isDefault } = address;
  const { mutateAsync: setDefaultAddress, isPending } = useSetDefaultAddress();
  
    const handleSetDefault = async () => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      console.error("Failed to set default address", err);
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 relative font-arial ">
      {isDefault && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-white text-xs px-2 py-1 tracking-wider font-medium">
            DEFAULT
          </span>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-normal text-gray-900 mb-4">
          {name}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
            {type}
          </p>
          <p>{fullAddress}</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {phone}
        </p>

        <div className="flex items-center gap-4 text-xs">
          <button
          onClick={() => onEdit(address)}
           className="text-gray-900 hover:text-gray-600 font-medium tracking-wider">
            EDIT
          </button>

          {/* <button className="text-gray-400 hover:text-gray-600 font-medium tracking-wider">
            REMOVE
          </button> */}

           {!isDefault && (
            <button
              onClick={handleSetDefault}
              disabled={isPending}
              className="ml-auto text-gray-600 hover:text-gray-800 cursor-pointer  border p-2 font-medium tracking-wider
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "SETTING..." : "SET AS DEFAULT"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
