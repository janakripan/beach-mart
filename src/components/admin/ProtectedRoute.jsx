import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../pages/Auth/store/AuthStore";

const ProtectedRoute = ({ adminOnly = false }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  // Not logged in → go to signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in but user missing → corrupted state → force logout
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Admin-only route but user is not admin
  if (adminOnly && user.Role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // Allowed
  return <Outlet />;
};

export default ProtectedRoute;
