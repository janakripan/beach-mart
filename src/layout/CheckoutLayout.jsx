import { Outlet, useLocation } from "react-router-dom";
import StepIndicator from "../pages/user/Checkout/components/shared/StepIndicator";
import SessionExpiryModal from "../pages/user/Checkout/components/shared/SessionExpiryModal";
import OrderSummary from "../pages/user/Checkout/components/shared/OrderSummary";
import { useCheckoutNavigation } from "../pages/user/Checkout/hooks/useCheckoutNavigation";
import RemainingSteps from "../pages/user/Checkout/components/shared/RemainingSteps";
import { useAuthStore } from "../pages/Auth/store/AuthStore";

const CheckoutLayout = () => {
  useCheckoutNavigation();
  const location = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location.pathname }} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-poppins">
      <h1 className="font-semibold text-xl py-5">Checkout</h1>
      {/* 🔹 Main checkout body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Step content */}
        <main className="flex flex-col gap-5 ">
          <StepIndicator>
            <Outlet />
          </StepIndicator>
          <RemainingSteps />
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
