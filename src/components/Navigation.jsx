import { useState } from 'react';

import { Link } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, LogOut, Heart, UserRound, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
  };

  const staticLinks = [
    ['About', '/about'],
    ['Careers', '/careers'],
    ['Contact us', '/contact'],
    ['Partner with us', '/register'],
  ];

  const roleLinks = user?.role === 'customer'
    ? [['Explore', '/restaurants'], ['Track order', '/orders/track'], ['History', '/orders'], ['Reviews', '/reviews']]
    : user?.role === 'vendor'
      ? [['Dashboard', '/vendor/dashboard'], ['Orders', '/vendor/orders'], ['Menu', '/vendor/menu'], ['Analytics', '/vendor/analytics'], ['Payouts', '/vendor/payouts']]
      : user?.role === 'delivery'
        ? [['Active route', '/delivery/dashboard'], ['Assignments', '/delivery/assignments'], ['Earnings', '/delivery/earnings'], ['Performance', '/delivery/performance']]
        : user?.role === 'admin'
          ? [['Overview', '/admin/dashboard'], ['Users', '/admin/users'], ['Orders', '/admin/orders'], ['Transactions', '/admin/transactions'], ['Reports', '/admin/reports']]
          : [];

  const navLinks = [...staticLinks, ...roleLinks];

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-3">

        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <div className="brand-mark p-2 rounded-xl text-white">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="brand-name font-bold text-xl">BiteExpress</span>
        </Link>

        <nav className="hidden lg:flex items-center flex-wrap justify-center gap-x-5 xl:gap-x-6 min-w-0">
          {staticLinks.map(([label, path]) => (
            <Link key={path} to={path} className="nav-link font-medium text-sm whitespace-nowrap">{label}</Link>
          ))}

          {roleLinks.length > 0 && roleLinks.map(([label, path]) => (
            <Link key={path} to={path} className="nav-link font-medium text-sm whitespace-nowrap">{label}</Link>
          ))}
        </nav>

        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden ml-auto p-2 text-gray-600 shrink-0" aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}>
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-4">
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

          {user ? (
            <div className="hidden lg:flex items-center space-x-3 border-l border-gray-200 pl-4">
              {user.role === 'customer' && <Link to="/favorites" className="text-gray-500 hover:text-orange-500" title="Favorites"><Heart className="w-5 h-5" /></Link>}
              <Link to={user.role === 'customer' ? '/account' : user.role === 'admin' ? '/admin/settings' : `/${user.role}/profile`} className="text-gray-500 hover:text-orange-500" title="Account"><UserRound className="w-5 h-5" /></Link>

              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:inline-flex bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map(([label, path]) => (
            <Link key={path} to={path} onClick={() => setIsMobileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-600">
              {label}
            </Link>
          ))}
          {user && (
            <>
              <Link to={user.role === 'customer' ? '/account' : user.role === 'admin' ? '/admin/settings' : `/${user.role}/profile`} onClick={() => setIsMobileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-orange-50">
                Account settings
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link to="/login" onClick={() => setIsMobileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};