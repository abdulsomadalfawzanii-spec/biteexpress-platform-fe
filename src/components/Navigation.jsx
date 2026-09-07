import { useState } from 'react';

import { Link } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, LogOut, Heart, UserRound, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = user?.role === 'customer'
    ? [['Explore', '/restaurants'], ['Track order', '/orders/track'], ['History', '/orders'], ['Reviews', '/reviews']]
    : user?.role === 'vendor'
      ? [['Dashboard', '/vendor/dashboard'], ['Orders', '/vendor/orders'], ['Menu', '/vendor/menu'], ['Analytics', '/vendor/analytics'], ['Payouts', '/vendor/payouts']]
      : user?.role === 'delivery'
        ? [['Active route', '/delivery/dashboard'], ['Assignments', '/delivery/assignments'], ['Earnings', '/delivery/earnings'], ['Performance', '/delivery/performance']]
        : user?.role === 'admin'
          ? [['Overview', '/admin/dashboard'], ['Users', '/admin/users'], ['Orders', '/admin/orders'], ['Transactions', '/admin/transactions'], ['Reports', '/admin/reports']]
          : [];

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="brand-mark p-2 rounded-xl text-white">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="brand-name font-bold text-xl">BiteExpress</span>
        </Link>

        {/* Dynamic Navigation Links based on Active Role */}
        <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6 min-w-0">
          {user?.role === 'customer' && (
            <>
              <Link to="/restaurants" className="nav-link font-medium">Explore</Link>
              <Link to="/orders/track" className="nav-link font-medium">Track Order</Link>
              <Link to="/orders" className="nav-link font-medium">History</Link>
            </>
          )}
          {user?.role === 'vendor' && (
            <>
              <Link to="/vendor/dashboard" className="nav-link font-medium">Vendor Hub</Link>
              <Link to="/vendor/orders" className="nav-link font-medium">Orders</Link>
              <Link to="/vendor/menu" className="nav-link font-medium">Menu Editor</Link>
              <Link to="/vendor/finance" className="nav-link font-medium">Finance</Link>
            </>
          )}
          {user?.role === 'delivery' && (
            <><Link to="/delivery/dashboard" className="nav-link font-medium">Active route</Link><Link to="/delivery/assignments" className="nav-link font-medium">Assignments</Link><Link to="/delivery/history" className="nav-link font-medium">Earnings</Link></>
          )}
          {user?.role === 'admin' && (
            <><Link to="/admin/dashboard" className="nav-link font-medium">Overview</Link><Link to="/admin/orders" className="nav-link font-medium">Orders</Link><Link to="/admin/settings" className="nav-link font-medium">Settings</Link></>
          )}
        </nav>

        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden ml-auto p-2 text-gray-600 shrink-0" aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}>
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Actions & Role Switcher */}
        <div className="flex items-center space-x-4">
          
          {/* Dev role switcher removed — use real login at /login */}

          {/* Cart Icon for Customer */}
          {user?.role === 'customer' && (
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-500">
              <ShoppingBag className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          )}

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              {user.role === 'customer' && <Link to="/favorites" className="text-gray-500 hover:text-orange-500" title="Favorites"><Heart className="w-5 h-5" /></Link>}
              <Link to={user.role === 'customer' ? '/account' : user.role === 'admin' ? '/admin/settings' : `/${user.role}/profile`} className="text-gray-500 hover:text-orange-500" title="Account"><UserRound className="w-5 h-5" /></Link>
              
              <button onClick={logout} className="text-gray-400 hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
              Sign In
            </Link>
          )}
        </div>
      </div>
      {isMobileOpen && <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">{links.map(([label, path]) => <Link key={path} to={path} onClick={() => setIsMobileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-600">{label}</Link>)}{user && <Link to={user.role === 'customer' ? '/account' : user.role === 'admin' ? '/admin/settings' : `/${user.role}/profile`} onClick={() => setIsMobileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-orange-50">Account settings</Link>}</div>}
    </header>
  );
};