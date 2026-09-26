import { useLocation } from "react-router-dom";
import OrderSummary from "../pages/user/Checkout/components/shared/OrderSummary";
import AddressForm from "../pages/user/Checkout/components/shared/AddressForm";
import { useAuthStore } from "../pages/Auth/store/AuthStore";

const CheckoutLayout = () => {
  const location = useLocation();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-poppins">
      <h1 className="font-semibold text-xl py-5">Checkout</h1>
      {/* 🔹 Main checkout body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Address Form */}
        <main className="flex flex-col gap-5 ">
          <AddressForm />
        </main>

        {/* RIGHT: Order summary */}
        <aside className=" ">
          <OrderSummary />
        </aside>

      </div>

      {/* Global checkout modals */}

    </div>
  );
};

export default CheckoutLayout;
