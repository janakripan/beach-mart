import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute component that checks for user authentication
 * before rendering child components
 *
 * @param {Object} props Component props
 * @param {boolean} props.isAuthenticated Whether the user is authenticated
 * @param {string} props.redirectPath Path to redirect unauthenticated users
 * @param {React.ReactNode} props.children Child components to render if authenticated
 * @returns {React.ReactNode} Protected component or redirect
 */
const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = "/auth/login",
  children,
}) => {
  // If not authenticated, redirect to the specified path
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if provided, otherwise render an Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
