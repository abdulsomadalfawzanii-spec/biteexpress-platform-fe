import { useMemo } from 'react';
import { Navigation as NavIcon, MapPin, CheckCircle, Package } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/currency';

export const DeliveryDashboard = () => {
  const { orders = [], delivery = {}, updateOrderStatus, setDelivery } = usePlatform();

  const activeDelivery = useMemo(() => orders.find((order) => ['assigned', 'picked_up', 'on_the_way'].includes((order.status || '').toLowerCase())) || null, [orders]);

  const handleAdvanceStatus = async () => {
    if (!activeDelivery) return;
    const nextStatus = (activeDelivery.status || '').toLowerCase() === 'assigned'
      ? 'picked_up'
      : (activeDelivery.status || '').toLowerCase() === 'picked_up'
        ? 'on_the_way'
        : 'delivered';

    await updateOrderStatus(activeDelivery.id, nextStatus);
    if (nextStatus === 'delivered') {
      setDelivery({ ...delivery, completedToday: (delivery.completedToday || 0) + 1 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Courier Portal</h1>
          <p className="text-xs text-gray-400">Status: {delivery.online ? 'Online & Looking for Jobs' : 'Offline'}</p>
        </div>
        <button onClick={() => setDelivery({ online: !delivery.online })} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${delivery.online ? 'bg-red-50 text-red-600' : 'bg-green-500 text-white'}`}>
          {delivery.online ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {activeDelivery ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="font-bold text-orange-500 text-sm">Active Job #{activeDelivery.id}</span>
            <span className="font-bold text-green-600 text-lg">{formatCurrency(activeDelivery.total)}</span>
          </div>

          <div className="bg-slate-100 h-48 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-200">
            <div className="text-center">
              <NavIcon className="w-8 h-8 text-orange-500 mx-auto animate-bounce mb-1" />
              <p className="text-xs font-semibold text-gray-500">Live delivery route</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-400">PICKUP LOCATION</p>
                <p className="font-bold text-gray-900">{activeDelivery.vendorName || 'Restaurant'}</p>
                <p className="text-sm text-gray-500">{activeDelivery.address || 'Pickup address'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-400">DROP-OFF LOCATION</p>
                <p className="font-bold text-gray-900">{activeDelivery.address || 'Customer delivery address'}</p>
              </div>
            </div>
          </div>

          {((activeDelivery.status || '').toLowerCase() === 'assigned' || (activeDelivery.status || '').toLowerCase() === 'picked_up' || (activeDelivery.status || '').toLowerCase() === 'on_the_way') && (
            <button onClick={handleAdvanceStatus} className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600">
              {(activeDelivery.status || '').toLowerCase() === 'assigned' ? 'Confirm Order Picked Up' : (activeDelivery.status || '').toLowerCase() === 'picked_up' ? 'Mark On the Way' : 'Complete Delivery'}
            </button>
          )}

          {((activeDelivery.status || '').toLowerCase() === 'delivered') && (
            <div className="w-full bg-green-50 text-green-700 py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5" /> Delivery completed</div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm font-medium">No active delivery assignments right now.</p>
        </div>
      )}
    </div>
  );
};