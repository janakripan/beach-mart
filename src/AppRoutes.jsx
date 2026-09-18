import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import UserLayout from "./layout/user/UserLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import DotWaveLoader from "./components/admin/DotWaveLoader";

// Public pages for beach-mart
import LandingPage from "./pages/user/LandingPage/LandingPage";
import Shop from "./pages/user/Shop/Shop";
import Contact from "./pages/user/Contact/Contact";

// User protected pages

const Wishlist = lazy(() => import("./pages/user/Wishlist/Wishlist"));

// Auth
const AdminLoginPage = lazy(() => import("./pages/Auth/AdminLogin/page"));

// Checkout
import CheckoutGuard from "./components/user/CheckoutGuard";
const CheckoutLayout = lazy(() => import("./layout/CheckoutLayout"));
const AddressStep = lazy(() => import("./pages/user/Checkout/components/steps/AddressStep"));
const ReviewStep = lazy(() => import("./pages/user/Checkout/components/steps/ReviewStep"));
const StripePaymentRoute = lazy(() => import("./pages/user/Checkout/components/StripePaymentRoute"));

// Admin pages
const Dashboard = lazy(() => import("./pages/admin/DashboardHome"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Customers = lazy(() => import("./pages/admin/Customers/Customers"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Brands = lazy(() => import("./pages/admin/Brands"));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const Sizes = lazy(() => import("./pages/admin/Sizes"));
const BannerManagement = lazy(() => import("./pages/admin/Banner"));
const Returns = lazy(() => import("./pages/admin/Returns"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-white">
          <DotWaveLoader />
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
          </Route>

          {/* Checkout routes */}
          <Route element={<CheckoutGuard />}>
            <Route path="/checkout" element={<CheckoutLayout />}>
              <Route path="address" element={<AddressStep />} />
              <Route path="review" element={<ReviewStep />} />
              <Route path="payment" element={<StripePaymentRoute />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="returns" element={<Returns />} />
              <Route path="customers" element={<Customers />} />
              <Route path="categories" element={<Categories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="banner" element={<BannerManagement />} />
              <Route path="size" element={<Sizes />} />
              <Route path="productlist" element={<ProductList />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
