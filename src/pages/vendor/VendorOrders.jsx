import { useEffect, useMemo, useState } from 'react';
import { Clock, Phone, MapPin } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { formatCurrency } from '../../utils/currency';

const normalizeOrder = (order) => {
  const rawStatus = order.orderStatus || order.status || 'pending';
  const statusLabel = rawStatus === 'ready_for_pickup' ? 'Ready' : rawStatus === 'preparing' ? 'Preparing' : rawStatus === 'confirmed' ? 'Confirmed' : rawStatus === 'delivered' ? 'Completed' : rawStatus === 'rejected' ? 'Rejected' : rawStatus === 'cancelled' ? 'Cancelled' : 'Pending';

  return {
    id: order._id || order.id,
    customerName: order.customer?.name || order.customerName || 'Customer',
    customerPhone: order.customer?.phone || order.customerPhone || '',
    address: order.deliveryAddress || order.address || 'Address unavailable',
    items: Array.isArray(order.items) ? order.items.map((item) => ({
      name: item.name || 'Menu item',
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
    })) : [],
    totalAmount: Number(order.total || 0),
    status: statusLabel,
    timestamp: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recently',
  };
};

export const VendorOrders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await vendorService.getOrders();
      setOrders(Array.isArray(data) ? data.map(normalizeOrder) : (Array.isArray(data?.data) ? data.data.map(normalizeOrder) : []));
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadOrders, 0);
    return () => clearTimeout(timer);
  }, []);

  const statusBadges = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Preparing: 'bg-blue-50 text-blue-700 border-blue-200',
    Ready: 'bg-purple-50 text-purple-700 border-purple-200',
    Completed: 'bg-green-50 text-green-700 border-green-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const apiStatus = newStatus === 'Preparing' ? 'preparing' : newStatus === 'Ready' ? 'ready_for_pickup' : newStatus === 'Rejected' ? 'rejected' : 'confirmed';
    try {
      await vendorService.updateOrderStatus(orderId, apiStatus);
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
    }
  };

  const filteredOrders = useMemo(() => activeTab === 'All' ? orders : orders.filter((order) => order.status === activeTab), [activeTab, orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incoming Orders</h1>
          <p className="text-gray-500 text-sm">Manage incoming customer requests and kitchen preparation workflow.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-2">
        {['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Rejected'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition ${activeTab === tab ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            {tab} {tab !== 'All' && `(${orders.filter(o => o.status === tab).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-6 text-center">{error}</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-400 font-medium">No orders found matching status "{activeTab}".</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-200 transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-gray-900 text-lg">{order.id}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBadges[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{order.status}</span>
                      <span className="text-xs text-gray-400 flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {order.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="font-semibold">{order.customerName}</span>
                      {order.customerPhone && <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-gray-400" /> {order.customerPhone}</span>}
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {order.address}</span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <span className="text-xs text-gray-400 font-semibold block uppercase">Total Amount</span>
                    <span className="text-xl font-bold text-orange-500">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-800"><strong className="text-orange-500 mr-2">{item.quantity}x</strong> {item.name}</span>
                      <span className="font-semibold text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  {order.status === 'Pending' && (
                    <>
                      <button onClick={() => handleStatusChange(order.id, 'Rejected')} className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-xs font-bold transition">Reject Order</button>
                      <button onClick={() => handleStatusChange(order.id, 'Confirmed')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm transition">Accept Order</button>
                    </>
                  )}

                  {order.status === 'Confirmed' && (
                    <button onClick={() => handleStatusChange(order.id, 'Preparing')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm transition">Start Preparing</button>
                  )}

                  {order.status === 'Preparing' && (
                    <button onClick={() => handleStatusChange(order.id, 'Ready')} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition">Mark Ready for Driver Pickup</button>
                  )}

                  {order.status === 'Ready' && (
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-xl flex items-center"><Clock className="w-4 h-4 mr-1.5" /> Waiting for delivery driver assignment</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
