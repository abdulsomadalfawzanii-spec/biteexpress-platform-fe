import { useMemo } from 'react';
import { DollarSign, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

export const VendorDashboard = () => {
  const { orders = [], updateOrderStatus } = usePlatform();
  const { user } = useAuth();

  const vendorOrders = useMemo(() => orders.filter((order) => {
    const s = (order.orderStatus || order.status || '').toLowerCase();
    return s !== 'delivered' && s !== 'cancelled' && s !== 'rejected';
  }), [orders]);

  const completedOrders = orders.filter((o) =>
    (o.orderStatus || o.status || '').toLowerCase() === 'delivered'
  );
  const activeRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  // ── Pending approval screen ──────────────────────────────────────────────
  if (user?.accountStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Awaiting approval</h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Your restaurant account is currently under review by our team.
            You'll be able to manage your menu and receive orders once approved.
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-sm text-orange-700 text-left space-y-1 max-w-sm mx-auto">
          <p className="font-semibold">What happens next?</p>
          <p>1. Our team reviews your restaurant details.</p>
          <p>2. You'll receive an email when approved.</p>
          <p>3. Log back in to start accepting orders.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/vendor/profile" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition">
            Complete your profile
          </Link>
          <Link to="/vendor/menu" className="border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition">
            Set up your menu
          </Link>
        </div>
      </div>
    );
  }

  // ── Active vendor dashboard ──────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Operational Dashboard</h1>
          <p className="text-gray-500 text-sm">Live orders for your restaurant</p>
        </div>
        <span className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Store Accepting Orders
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Revenue earned</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(activeRevenue)}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><DollarSign className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Active orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{vendorOrders.length}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><ShoppingBag className="w-6 h-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completedOrders.length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-500"><CheckCircle className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Live queue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-900">Live Kitchen Queue</div>
        <div className="divide-y divide-gray-100">
          {vendorOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No active orders right now. New orders will appear here in real time.
            </div>
          ) : vendorOrders.map((order) => {
            const s = (order.orderStatus || order.status || '').toLowerCase();
            return (
              <div key={order.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">#{String(order.id || '').slice(-8).toUpperCase()}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{order.customerName || order.customer}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items?.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm mt-1">{formatCurrency(order.total)}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {s === 'pending' && (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 transition">
                        Accept &amp; Cook
                      </button>
                      <button onClick={() => updateOrderStatus(order.id, 'rejected')}
                        className="bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-xs hover:bg-red-50 hover:text-red-600 transition">
                        Reject
                      </button>
                    </>
                  )}
                  {s === 'confirmed' && (
                    <button onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600 transition">
                      Start Preparing
                    </button>
                  )}
                  {s === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                      className="bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-purple-600 transition">
                      Mark Ready for Pickup
                    </button>
                  )}
                  {s === 'ready_for_pickup' && (
                    <span className="text-green-600 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Awaiting Driver
                    </span>
                  )}
                  {['assigned', 'picked_up', 'on_the_way'].includes(s) && (
                    <span className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full capitalize">
                      {s.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
