import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, MapPin, Navigation, Phone, Wallet } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { deliveryService } from '../../services/deliveryService';
import { formatCurrency } from '../../utils/currency';

export const DeliveryAssignments = () => {
  const { orders, refreshPlatform } = usePlatform();
  const [accepted, setAccepted] = useState(null);
  const [error, setError] = useState('');
  const available = orders.filter((order) => (order.orderStatus || order.status) === 'ready_for_pickup');
  const handleClaim = async (orderId) => {
    setError('');
    try {
      await deliveryService.claimDelivery(orderId);
      setAccepted(orderId);
      await refreshPlatform();
    } catch (err) {
      setError(err.message || 'Unable to claim this delivery.');
    }
  };
  return <div className="max-w-6xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">Delivery queue</p><h1 className="text-3xl font-bold text-gray-900">Available assignments</h1><p className="text-gray-500 mt-2">Choose a route that fits your shift.</p></div>{error && <p className="text-sm text-red-600">{error}</p>}{available.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center border border-gray-100"><Clock3 className="w-10 h-10 text-orange-300 mx-auto mb-3" /><p className="font-bold text-gray-900">No new routes right now</p><p className="text-sm text-gray-500 mt-1">Keep this screen open for the next kitchen handoff.</p></div> : <div className="grid md:grid-cols-2 gap-5">{available.map((order) => <article key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5"><div className="flex justify-between"><span className="font-bold">{order.id}</span><span className="font-bold text-green-600">{formatCurrency(Number(order.total || 0) * 0.08)}</span></div><p className="text-sm text-gray-500 mt-3">{order.vendorName}</p><div className="space-y-3 mt-5 text-sm"><p className="flex gap-2"><Navigation className="w-4 h-4 text-orange-500" /> {order.vendorAddress || 'Kitchen pickup'}</p><p className="flex gap-2"><MapPin className="w-4 h-4 text-orange-500" /> {order.address || 'Customer delivery address'}</p></div><button onClick={() => handleClaim(order.id)} disabled={accepted === order.id} className="mt-6 w-full bg-orange-500 text-white rounded-xl py-3 font-bold disabled:opacity-60">{accepted === order.id ? 'Assignment accepted' : 'Accept route'} <ArrowRight className="inline w-4 h-4 ml-1" /></button></article>)}</div>}</div>;
};

export const DeliveryHistory = () => {
  const { orders, delivery = {} } = usePlatform();
  const delivered = orders.filter((order) => (order.orderStatus || order.status || '').toLowerCase() === 'delivered');
  const totalEarnings = delivered.reduce((sum, order) => sum + Number(order.total || 0) * 0.08, 0);
  return <div className="max-w-5xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">Your driving record</p><h1 className="text-3xl font-bold text-gray-900">Earnings and history</h1></div><div className="grid md:grid-cols-3 gap-5"><div className="bg-gray-900 rounded-2xl p-5 text-white"><Wallet className="text-orange-300" /><p className="text-gray-400 text-sm mt-5">Today's earnings</p><p className="text-3xl font-bold mt-1">{formatCurrency(delivery.earningsToday || totalEarnings)}</p></div><div className="bg-white rounded-2xl border border-gray-100 p-5"><CheckCircle2 className="text-green-500" /><p className="text-gray-500 text-sm mt-5">Deliveries completed</p><p className="text-3xl font-bold mt-1">{delivery.completedToday || delivered.length}</p></div><div className="bg-white rounded-2xl border border-gray-100 p-5"><Clock3 className="text-orange-500" /><p className="text-gray-500 text-sm mt-5">Average delivery</p><p className="text-3xl font-bold mt-1">Based on completed orders</p></div></div><div className="bg-white rounded-3xl border border-gray-100 p-6"><h2 className="font-bold text-gray-900 mb-4">Recent deliveries</h2>{delivered.map((order) => <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 border-b border-gray-100 last:border-0"><div><p className="font-bold">{order.id} · {order.vendorName}</p><p className="text-sm text-gray-500">{order.address} · {order.createdAt}</p></div><span className="font-bold text-green-600">+{formatCurrency(Number(order.total || 0) * 0.08)}</span></div>)}</div></div>;
};

export const DeliveryContact = () => <button className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:text-orange-500" title="Call customer"><Phone className="w-5 h-5" /></button>;
