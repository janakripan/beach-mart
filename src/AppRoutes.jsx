import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import UserLayout from "./layout/user/UserLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import DotWaveLoader from "./components/admin/DotWaveLoader";
import ScrollToTop from "./components/admin/ScrollToTop";

// Public pages for beach-mart (lazy-loaded to reduce initial bundle)
const LandingPage = lazy(() => import("./pages/user/LandingPage/LandingPage"));
const Shop        = lazy(() => import("./pages/user/Shop/Shop"));
const Contact     = lazy(() => import("./pages/user/Contact/Contact"));

// User protected pages

const Wishlist = lazy(() => import("./pages/user/Wishlist/Wishlist"));
const PurchaseSuccess = lazy(() => import("./pages/user/PurchaseSuccess/PurchaseSuccess"));

// Auth
const AdminLoginPage = lazy(() => import("./pages/Auth/AdminLogin/page"));

// Checkout
import CheckoutGuard from "./components/user/CheckoutGuard";
const CheckoutLayout = lazy(() => import("./layout/CheckoutLayout"));

// Admin pages
const Orders = lazy(() => import("./pages/admin/Orders"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const Variants = lazy(() => import("./pages/admin/Variants"));
const BannerManagement = lazy(() => import("./pages/admin/Banner"));
const DeliveryLocation = lazy(() => import("./pages/admin/DeliveryLocation"));
const DeliveryMode = lazy(() => import("./pages/admin/DeliveryMode"));
const PaymentMode = lazy(() => import("./pages/admin/PaymentMode"));

const AppRoutes = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Hide the DotWaveLoader for the first 5 seconds to let the SplashScreen cover the initial loading
    const timer = setTimeout(() => setIsInitialLoad(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-white">
          {!isInitialLoad && <DotWaveLoader />}
        </div>
      }>
        <Routes>
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          
          {/* Public routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/purchase-success" element={<PurchaseSuccess />} />
          </Route>

          {/* Checkout routes */}
          <Route element={<UserLayout />}>
            <Route element={<CheckoutGuard />}>
              <Route path="/checkout" element={<CheckoutLayout />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Orders />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Categories />} />
              <Route path="banner" element={<BannerManagement />} />
              <Route path="variants" element={<Variants />} />
              <Route path="productlist" element={<ProductList />} />
              <Route path="delivery-location" element={<DeliveryLocation />} />
              <Route path="delivery-mode" element={<DeliveryMode />} />
              <Route path="payment-mode" element={<PaymentMode />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
