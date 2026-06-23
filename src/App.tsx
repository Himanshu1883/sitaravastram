import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import BottomNav from './components/layout/BottomNav';
import FloatingActions from './components/ui/FloatingActions';
import AuthModal from './components/auth/AuthModal';
import AdminProtected from './components/admin/AdminProtected';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLogin = location.pathname === '/admin/login';
  const isStorefront = !isAdminRoute;

  return (
    <>
      {!isAdminLogin && <Navbar showCategoryStrip={location.pathname === '/' && !isAdminRoute} />}

      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <Navigate to="/admin/dashboard" replace />
            </AdminProtected>
          }
        />
        <Route
          path="/admin/:tab"
          element={
            <AdminProtected>
              <AdminPage />
            </AdminProtected>
          }
        />

        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/:tab" element={<AccountPage />} />
        <Route path="/shop" element={<CollectionPage />} />
        <Route path="/occasions" element={<CollectionPage />} />
        <Route path="/sale" element={<CollectionPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      {isStorefront && (
        <>
          <Footer />
          <CartDrawer />
          <BottomNav />
          <FloatingActions />
          <AuthModal />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
