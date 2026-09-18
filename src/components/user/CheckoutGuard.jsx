import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../pages/Auth/store/AuthStore";
import { useCartStore } from "../../pages/user/Cart/store/CartStore";

const CheckoutGuard = () => {
  const items = useCartStore((s) => s.items);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  // if (!items.length) {
  //   return <Navigate to="/" replace />;
  // }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        state={{ from: "/checkout/address" }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default CheckoutGuard;
