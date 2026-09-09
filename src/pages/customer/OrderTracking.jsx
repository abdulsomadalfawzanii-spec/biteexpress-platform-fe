import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, Phone, RefreshCw, AlertCircle, Package } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/currency';

/* Status step definitions — driven entirely by backend orderStatus */
const STEPS = [
  { key: 'pending',          label: 'Order Placed',       icon: Package },
  { key: 'confirmed',        label: 'Confirmed',          icon: CheckCircle2 },
  { key: 'preparing',        label: 'Preparing',          icon: Clock },
  { key: 'ready_for_pickup', label: 'Ready for Pickup',   icon: CheckCircle2 },
  { key: 'assigned',         label: 'Driver Assigned',    icon: CheckCircle2 },
  { key: 'picked_up',        label: 'Picked Up',          icon: CheckCircle2 },
  { key: 'on_the_way',       label: 'On the Way',         icon: Clock },
  { key: 'delivered',        label: 'Delivered',          icon: CheckCircle2 },
];

const STATUS_ORDER = STEPS.map((s) => s.key);

const STATUS_LABELS = {
  pending:          'Your order has been placed and is waiting for the restaurant.',
  confirmed:        'The restaurant has confirmed your order.',
  preparing:        'The kitchen is preparing your food.',
  ready_for_pickup: 'Your order is ready and waiting for a driver.',
  assigned:         'A driver has been assigned to your delivery.',
  picked_up:        'Your driver has picked up your order.',
  on_the_way:       "You're almost there — your driver is on the way!",
  delivered:        'Your order has been delivered. Enjoy your meal!',
  rejected:         'Your order was rejected by the restaurant.',
  cancelled:        'This order has been cancelled.',
};

export const OrderTracking = () => {
  const { orders } = usePlatform();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('id');

  const allowedTrackStatuses = new Set([
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'assigned',
    'picked_up',
    'on_the_way',
  ]);

  const getOrderStatus = (entry) => String(entry?.orderStatus || entry?.status || 'pending').toLowerCase();

  const pickContextOrder = () => {
    if (orderIdParam) {
      return orders.find((o) => String(o.id) === orderIdParam || String(o._id) === orderIdParam) || null;
    }

    const activeOrders = orders
      .filter((o) => {
        const status = getOrderStatus(o);
        return allowedTrackStatuses.has(status);
      })
      .sort((a, b) => {
        const aDate = new Date(a?.createdAt || a?.createdAt || Date.now()).getTime();
        const bDate = new Date(b?.createdAt || b?.createdAt || Date.now()).getTime();
        return bDate - aDate;
      });

    return activeOrders[0] || orders[0] || null;
  };

  const contextOrder = pickContextOrder();

  const [order,   setOrder]   = useState(contextOrder || null);
  const [loading, setLoading] = useState(!contextOrder);
  const [error,   setError]   = useState('');
  const [polling, setPolling] = useState(false);

  const orderId = order?._id || order?.id;
  const fetchOrderRef = useRef(null);

  const fetchOrder = useCallback(async (showLoader = false) => {
    if (!orderId) return;
    if (showLoader) setLoading(true);
    setPolling(true);
    try {
      const fresh = await orderService.getById(orderId);
      setOrder(fresh);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not refresh order status.');
    } finally {
      setLoading(false);
      setPolling(false);
    }
  }, [orderId]);
  useEffect(() => {
    fetchOrderRef.current = fetchOrder;
  }, [fetchOrder]);

  // Initial load if we have an ID
  useEffect(() => {
    if (!contextOrder) queueMicrotask(() => setLoading(false));
  }, [contextOrder, orders]);

  // Auto-refresh every 30 seconds while order is active
  useEffect(() => {
    if (!orderId) return;
    const status = order?.orderStatus || order?.status;
    const isActive = !['delivered', 'cancelled', 'rejected'].includes(status);
    if (!isActive) return;

    const interval = setInterval(() => fetchOrderRef.current?.(false), 30_000);
    return () => clearInterval(interval);
  }, [orderId, order?.orderStatus, order?.status]);

  const status   = order?.orderStatus || order?.status || 'pending';
  const stepIdx  = STATUS_ORDER.indexOf(status);
  const isFinal  = ['delivered', 'cancelled', 'rejected'].includes(status);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      <p className="text-[var(--muted)]">Loading order status…</p>
    </div>
  );

  if (!order) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[var(--orange)] flex items-center justify-center mx-auto">
        <Package className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--ink)]">No active order found</h1>
      <p className="text-[var(--muted)]">Place an order to track it here in real time.</p>
      <Link to="/restaurants" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition">
        Browse restaurants
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wide">
              Order #{String(orderId || '').slice(-8).toUpperCase() || 'NEW'}
            </span>
            <h1 className="text-xl font-bold text-[var(--ink)] mt-2">
              {STATUS_LABELS[status] || status}
            </h1>
            {order?.vendorName && (
              <p className="text-sm text-[var(--muted)] mt-1">{order.vendorName}</p>
            )}
          </div>
          <button
            onClick={() => fetchOrder(true)}
            disabled={polling}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition disabled:opacity-50 shrink-0"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${polling ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Status stepper — horizontal scroll on mobile */}
        {!['rejected', 'cancelled'].includes(status) && (
          <div className="overflow-x-auto -mx-2 px-2 pb-2">
            <div className="relative flex justify-between items-start my-6" style={{ minWidth: `${STEPS.length * 7}rem` }}>
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--line)] z-0" />
              {stepIdx > 0 && (
                <div
                  className="absolute top-5 left-0 h-0.5 bg-orange-500 z-0 transition-all duration-700"
                  style={{ width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }}
                />
              )}

              {STEPS.map((step, idx) => {
                const done   = idx < stepIdx || (status === step.key && isFinal);
                const active = idx === stepIdx && !isFinal;
                const Icon   = step.icon;

                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center bg-white px-2 text-center w-28">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      done   ? 'bg-emerald-500 text-white' :
                      active ? 'bg-orange-500 text-white ring-4 ring-orange-100' :
                               'bg-[var(--canvas)] text-[var(--muted)]'
                    }`}>
                      {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-[0.68rem] font-semibold mt-2 leading-tight ${active ? 'text-orange-600' : done ? 'text-emerald-700' : 'text-[var(--muted)]'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rejected / cancelled banner */}
        {['rejected', 'cancelled'].includes(status) && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold">{STATUS_LABELS[status]}</p>
          </div>
        )}
      </div>

      {/* Order summary */}
      {order?.items?.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-bold text-[var(--ink)] mb-4">Your order</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">{item.quantity}× {item.name}</span>
                <span className="font-semibold text-[var(--ink)]">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-[var(--ink)] pt-3 border-t border-[var(--line)]">
              <span>Total</span>
              <span className="text-orange-500">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Driver info — shown once assigned */}
      {['assigned', 'picked_up', 'on_the_way', 'delivered'].includes(status) && (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-[var(--shadow-soft)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--canvas)] border border-[var(--line)] flex items-center justify-center text-[var(--orange)] shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--ink)]">Driver assigned</h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">Your order is on its way</p>
            </div>
          </div>
          <div className="flex gap-3">
            {status === 'delivered' && (
              <Link
                to="/reviews"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition"
              >
                Leave a review
              </Link>
            )}
            <span className="p-3 rounded-xl bg-[var(--canvas)] border border-[var(--line)] text-[var(--muted)]">
              <Phone className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-center text-[var(--muted)]">
        Status refreshes automatically every 30 seconds · <button onClick={() => fetchOrder(true)} className="text-orange-500 hover:underline font-medium">Refresh now</button>
      </p>
    </div>
  );
};
