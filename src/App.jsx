import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PlatformProvider } from './context/PlatformContext';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Footer } from './components/Footer';
import { Home } from './pages/customer/Home';
import { RestaurantList } from './pages/customer/RestaurantList';
import { RestaurantDetail } from './pages/customer/RestaurantDetail';
import { CustomerAccount, OrderHistory } from './pages/customer/CustomerAccount';
import { Favorites } from './pages/customer/Favorites';
import { Login } from './pages/auth/Login';
import { AdminLogin } from './pages/auth/AdminLogin';
import { Register } from './pages/auth/Register';
import { ForgotPassword, ResetPassword, EmailVerification } from './pages/auth/AuthSupport';
import { Checkout, Payment, OrderConfirmation, OrderDetails, Reviews, Settings } from './pages/customer/CustomerOperations';

// View Imports
import { Cart } from './pages/customer/Cart';
import { OrderTracking } from './pages/customer/OrderTracking';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { VendorOrders } from './pages/vendor/VendorOrders';
import { MenuManagement } from './pages/vendor/MenuManagement';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VendorProfile, VendorFinance, VendorReviews } from './pages/vendor/VendorOperations';
import { DeliveryAssignments, DeliveryHistory } from './pages/delivery/DeliveryOperations';
import { AdminOrders, AdminSettings } from './pages/admin/AdminOperations';
import { VendorAnalytics, VendorCustomers, VendorPayouts, VendorNotifications, VendorSettings } from './pages/vendor/VendorMorePages';
import { AdminUsers, AdminVendors, AdminTransactions, AdminReports, AdminNotifications } from './pages/admin/AdminMorePages';
import { DeliveryEarnings, DeliveryPerformance, DeliveryRatings, DeliveryProfile } from './pages/delivery/DeliveryMorePages';

export default function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <CartProvider>
          <Router>
          <div className="app-shell text-gray-900 font-sans">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
                <Route path="/orders/track" element={<ProtectedRoute allowedRoles={['customer']}><OrderTracking /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute allowedRoles={['customer']}><CustomerAccount /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={['customer']}><OrderHistory /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute allowedRoles={['customer']}><Favorites /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute allowedRoles={['customer']}><Payment /></ProtectedRoute>} />
                <Route path="/order-confirmation" element={<ProtectedRoute allowedRoles={['customer']}><OrderConfirmation /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['customer']}><OrderDetails /></ProtectedRoute>} />
                <Route path="/reviews" element={<ProtectedRoute allowedRoles={['customer']}><Reviews /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute allowedRoles={['customer']}><Settings /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<EmailVerification />} />

                {/* Role-Gated Vendor Routes */}
                <Route 
                  path="/vendor/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <VendorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/vendor/orders"
                  element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <VendorOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/menu"
                  element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <MenuManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="/vendor/profile" element={<ProtectedRoute allowedRoles={['vendor']}><VendorProfile /></ProtectedRoute>} />
                <Route path="/vendor/finance" element={<ProtectedRoute allowedRoles={['vendor']}><VendorFinance /></ProtectedRoute>} />
                <Route path="/vendor/reviews" element={<ProtectedRoute allowedRoles={['vendor']}><VendorReviews /></ProtectedRoute>} />
                <Route path="/vendor/analytics" element={<ProtectedRoute allowedRoles={['vendor']}><VendorAnalytics /></ProtectedRoute>} />
                <Route path="/vendor/customers" element={<ProtectedRoute allowedRoles={['vendor']}><VendorCustomers /></ProtectedRoute>} />
                <Route path="/vendor/payouts" element={<ProtectedRoute allowedRoles={['vendor']}><VendorPayouts /></ProtectedRoute>} />
                <Route path="/vendor/notifications" element={<ProtectedRoute allowedRoles={['vendor']}><VendorNotifications /></ProtectedRoute>} />
                <Route path="/vendor/settings" element={<ProtectedRoute allowedRoles={['vendor']}><VendorSettings /></ProtectedRoute>} />

                {/* Role-Gated Delivery Routes */}
                <Route 
                  path="/delivery/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['delivery']}>
                      <DeliveryDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/delivery/assignments" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryAssignments /></ProtectedRoute>} />
                <Route path="/delivery/history" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryHistory /></ProtectedRoute>} />
                <Route path="/delivery/earnings" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryEarnings /></ProtectedRoute>} />
                <Route path="/delivery/performance" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryPerformance /></ProtectedRoute>} />
                <Route path="/delivery/ratings" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryRatings /></ProtectedRoute>} />
                <Route path="/delivery/profile" element={<ProtectedRoute allowedRoles={['delivery']}><DeliveryProfile /></ProtectedRoute>} />

                {/* Role-Gated Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={['admin']}><AdminVendors /></ProtectedRoute>} />
                <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><AdminTransactions /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
                <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotifications /></ProtectedRoute>} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </Router>
        </CartProvider>
      </PlatformProvider>
    </AuthProvider>
  );
}
