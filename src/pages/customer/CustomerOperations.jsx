import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Star, MapPin, Phone, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { apiRequest } from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const Shell = ({ eyebrow, title, description, children }) => (
  <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
    {children}
  </div>
);

/* ── Checkout ─────────────────────────────────────────
   Simple address confirmation step — Cart.jsx handles
   actual order creation & payment. This page is for
   reviewing delivery details before hitting Cart.
───────────────────────────────────────────────────── */
export const Checkout = () => {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const [address, setAddress] = useState(user?.address || '');
  const [note,    setNote]    = useState('');

  return (
    <Shell eyebrow="Almost yours" title="Review your order" description="Confirm the delivery details before proceeding to payment.">
      <div className="grid lg:grid-cols-[1fr_0.7fr] gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[var(--line)] space-y-5">
          <h2 className="text-lg font-bold text-[var(--ink)]">Delivery address</h2>

          <label className="block text-sm font-semibold text-[var(--ink)]">
            Street address
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-orange-500" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full pl-9 p-3 rounded-xl border border-[var(--line)] text-sm font-normal focus:outline-none focus:border-orange-400"
              />
            </div>
          </label>

          <label className="block text-sm font-semibold text-[var(--ink)]">
            Delivery note (optional)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Gate code, floor number, leave at door…"
              rows={3}
              className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] text-sm font-normal focus:outline-none focus:border-orange-400 resize-none"
            />
          </label>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Your cart items are ready for checkout.
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-3xl p-6 space-y-5">
          <h2 className="text-lg font-bold">Payment</h2>
          <p className="text-sm text-gray-400">
            Your order will be created and saved when you place it from the cart. Stripe payment is processed server-side when configured.
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl py-3.5 font-bold transition flex items-center justify-center gap-2"
          >
            Go to Cart &amp; Place Order
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Shell>
  );
};

/* ── Payment ─────────────────────────────────────────
   Stripe redirect landing or demo payment page.
   Reads order from navigation state if available.
───────────────────────────────────────────────────── */
export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order    = location.state?.order;

  useEffect(() => {
    if (order) navigate('/order-confirmation', { state: { order }, replace: true });
  }, [navigate, order]);

  if (order) return null;

  return (
    <Shell eyebrow="Secure checkout" title="Payment" description="Complete your payment to place the order.">
      <div className="max-w-xl bg-white rounded-3xl border border-[var(--line)] p-6 space-y-4">
        <p className="text-sm text-[var(--muted)]">
          Payment is handled securely by the backend. If Stripe is configured, you'll be redirected to Stripe Checkout after placing your order from the cart.
        </p>
        <button
          onClick={() => navigate('/cart')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3.5 font-bold transition flex items-center justify-center gap-2"
        >
          Return to Cart
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Shell>
  );
};

/* ── OrderConfirmation ───────────────────────────────
   Reads real order from navigation state (set by Cart).
   Falls back gracefully if navigated to directly.
───────────────────────────────────────────────────── */
export const OrderConfirmation = () => {
  const location = useLocation();
  const order    = location.state?.order;

  const orderId    = order?.id || order?._id || order?.orderId || null;
  const vendorName = order?.vendorName || order?.vendor?.restaurantName || 'the restaurant';
  const total      = order?.total != null ? Number(order.total).toFixed(2) : null;

  return (
    <Shell eyebrow="Order received" title="Your meal is on its way to the kitchen." description="We'll keep you updated at every step.">
      <div className="max-w-xl bg-white rounded-3xl border border-[var(--line)] p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        {orderId ? (
          <>
            <p className="text-[var(--muted)] text-sm">Order number</p>
            <p className="text-2xl font-bold text-[var(--ink)] mt-1 font-mono">
              #{String(orderId).slice(-8).toUpperCase()}
            </p>
          </>
        ) : (
          <p className="text-lg font-bold text-[var(--ink)]">Order placed successfully!</p>
        )}

        {vendorName && (
          <p className="text-sm text-[var(--muted)] mt-2">
            Sent to <span className="font-semibold text-[var(--ink)]">{vendorName}</span>
          </p>
        )}

        {total && (
          <p className="text-2xl font-bold text-orange-500 mt-3">{formatCurrency(total)}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link
            to={orderId ? `/orders/${orderId}` : '/orders/track'}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-3 font-bold transition"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] rounded-xl px-6 py-3 font-semibold hover:bg-[var(--canvas)] transition"
          >
            <Package className="w-4 h-4" />
            Order History
          </Link>
        </div>
      </div>
    </Shell>
  );
};

/* ── OrderDetails ────────────────────────────────────
   Fetches single order by ID from backend.
   Accessible to the order's customer.
───────────────────────────────────────────────────── */
export const OrderDetails = () => {
  const { id }    = useParams();
  const { orders } = usePlatform();

  // Try context first (instant), then fetch if needed
  const [order, setOrder] = useState(() =>
    orders.find((o) => String(o.id) === String(id) || String(o._id) === String(id)) || null
  );
  const [loading, setLoading] = useState(!order);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (order || !id) return;
    apiRequest(`/orders/${id}`)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message || 'Could not load order.'))
      .finally(() => setLoading(false));
  }, [id, order, orders]);

  if (loading) return (
    <Shell eyebrow="Receipt" title="Loading…" description="">
      <div className="bg-white rounded-3xl border border-[var(--line)] p-8 animate-pulse space-y-4">
        <div className="h-4 bg-[var(--canvas)] rounded w-1/3" />
        <div className="h-3 bg-[var(--canvas)] rounded w-2/3" />
        <div className="h-3 bg-[var(--canvas)] rounded w-1/2" />
      </div>
    </Shell>
  );

  if (error || !order) return (
    <Shell eyebrow="Receipt" title="Order not found" description={error || 'This order does not exist or you do not have access.'}>
      <Link to="/orders" className="text-orange-500 font-semibold hover:underline">← Back to order history</Link>
    </Shell>
  );

  const items      = order?.items || [];
  const statusMap  = {
    pending:          { label: 'Pending',         color: 'bg-yellow-50 text-yellow-700' },
    confirmed:        { label: 'Confirmed',        color: 'bg-blue-50 text-blue-700' },
    preparing:        { label: 'Preparing',        color: 'bg-orange-50 text-orange-700' },
    ready_for_pickup: { label: 'Ready for Pickup', color: 'bg-purple-50 text-purple-700' },
    assigned:         { label: 'Driver Assigned',  color: 'bg-indigo-50 text-indigo-700' },
    picked_up:        { label: 'Picked Up',        color: 'bg-sky-50 text-sky-700' },
    on_the_way:       { label: 'On the Way',       color: 'bg-cyan-50 text-cyan-700' },
    delivered:        { label: 'Delivered',        color: 'bg-emerald-50 text-emerald-700' },
    cancelled:        { label: 'Cancelled',        color: 'bg-red-50 text-red-600' },
    rejected:         { label: 'Rejected',         color: 'bg-red-50 text-red-600' },
  };
  const s = statusMap[order?.orderStatus || order?.status] || { label: order?.orderStatus || 'Unknown', color: 'bg-gray-50 text-gray-600' };

  return (
    <Shell eyebrow="Receipt" title={order?.id ? `Order #${String(order.id).slice(-8).toUpperCase()}` : 'Order details'}
      description={`${order?.vendorName || 'Restaurant'} · ${order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recently'}`}
    >
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white rounded-3xl border border-[var(--line)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--ink)]">Items ordered</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.color}`}>{s.label}</span>
          </div>
          {items.map((item, idx) => (
            <div key={item.id || item.name || idx} className="flex justify-between text-sm py-2 border-b border-[var(--line)] last:border-0">
              <span className="text-[var(--ink)]">{item.quantity}× {item.name}</span>
              <strong className="text-[var(--ink)]">{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="space-y-1.5 pt-2">
            {order.subtotal != null && <div className="flex justify-between text-sm text-[var(--muted)]"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>}
            {order.deliveryFee != null && <div className="flex justify-between text-sm text-[var(--muted)]"><span>Delivery fee</span><span>{formatCurrency(order.deliveryFee)}</span></div>}
            {order.tax != null && <div className="flex justify-between text-sm text-[var(--muted)]"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>}
            <div className="flex justify-between font-bold text-[var(--ink)] text-base pt-2 border-t border-[var(--line)]">
              <span>Total</span>
              <span className="text-orange-500">{formatCurrency(order?.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[var(--line)] p-5 space-y-3">
            <h2 className="font-bold text-[var(--ink)] text-sm uppercase tracking-wide">Delivery details</h2>
            <p className="text-sm text-[var(--muted)] flex gap-2"><MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />{order.address || order.deliveryAddress || '—'}</p>
            {order.customerPhone && <p className="text-sm text-[var(--muted)] flex gap-2"><Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />{order.customerPhone}</p>}
          </div>
          <Link to="/orders/track" className="flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-5 transition">
            <div>
              <p className="font-bold">Track live status</p>
              <p className="text-sm text-orange-100 mt-0.5">{s.label}</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </Shell>
  );
};

/* ── Reviews ─────────────────────────────────────────
   Submits real review to backend via /customer/reviews.
   Requires a completed order ID and vendor ID.
───────────────────────────────────────────────────── */
export const Reviews = () => {
  const { reviews, addReview, orders } = usePlatform();
  const { user } = useAuth();

  const [rating,  setRating]  = useState(5);
  const [text,    setText]    = useState('');
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitErr,  setSubmitErr]  = useState('');
  const [success,    setSuccess]    = useState(false);

  const deliveredOrders = orders.filter((o) => (o.orderStatus || o.status) === 'delivered');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitErr(''); setSubmitting(true);
    const selectedOrder = deliveredOrders.find((o) => String(o.id) === String(orderId));
    if (!selectedOrder) { setSubmitErr('Please select a completed order to review.'); setSubmitting(false); return; }

    try {
      await addReview({
        vendor:  selectedOrder.vendorId || selectedOrder.vendor,
        order:   selectedOrder.id || selectedOrder._id,
        rating,
        comment: text,
        customer: user?.name,
      });
      setText(''); setOrderId(''); setRating(5); setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSubmitErr(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell eyebrow="Your voice matters" title="Reviews & ratings" description="Help local kitchens understand what made your meal memorable.">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[var(--line)] p-6 space-y-4">
          <h2 className="font-bold text-[var(--ink)]">Leave a review</h2>

          {deliveredOrders.length > 0 ? (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Select completed order</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full mt-1.5 p-3 border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white"
              >
                <option value="">Choose an order…</option>
                {deliveredOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.vendorName} — {formatCurrency(o.total)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] bg-[var(--canvas)] rounded-xl p-3">
              You need at least one delivered order to leave a review.
            </p>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Rating</label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button type="button" key={v} onClick={() => setRating(v)} className={v <= rating ? 'text-amber-400' : 'text-gray-300'}>
                  <Star className="w-7 h-7 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Your experience</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Tell us about your meal…"
              className="w-full mt-1.5 p-3 rounded-xl border border-[var(--line)] text-sm resize-none focus:outline-none focus:border-orange-400"
            />
          </div>

          {submitErr && <p className="text-sm text-red-600">{submitErr}</p>}
          {success   && <p className="text-sm text-emerald-600 font-semibold">Review submitted — thank you!</p>}

          <button
            type="submit"
            disabled={submitting || deliveredOrders.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 font-bold transition disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Publish review'}
          </button>
        </form>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[var(--line)] p-8 text-center text-[var(--muted)]">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No reviews yet</p>
              <p className="text-sm mt-1">Your submitted reviews will appear here.</p>
            </div>
          ) : reviews.map((review) => (
            <article key={review.id} className="bg-white rounded-2xl border border-[var(--line)] p-5">
              <div className="flex justify-between">
                <strong className="text-[var(--ink)]">{review.customer}</strong>
                <span className="text-amber-400">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-2">{review.text || review.comment}</p>
              <p className="text-xs text-[var(--muted)] mt-3">{review.date}</p>
            </article>
          ))}
        </div>
      </div>
    </Shell>
  );
};

/* ── Settings ────────────────────────────────────────
   Saves notification preferences via customer profile.
───────────────────────────────────────────────────── */
export const Settings = () => {
  const [saved, setSaved]   = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [nearbyOffers, setNearbyOffers] = useState(false);

  const handleSave = async () => {
    try {
      await apiRequest('/customer/profile', {
        method: 'PUT',
        body: JSON.stringify({ preferences: { emailUpdates, nearbyOffers } }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    }
  };

  return (
    <Shell eyebrow="Preferences" title="Settings" description="Control notifications and your BiteExpress experience.">
      <div className="max-w-2xl bg-white rounded-3xl border border-[var(--line)] p-6 space-y-5">
        <label className="flex justify-between gap-4 cursor-pointer">
          <span>
            <strong className="text-[var(--ink)]">Email updates</strong>
            <small className="block text-[var(--muted)] mt-1">Order receipts and delivery progress</small>
          </span>
          <input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} className="accent-orange-500 w-5 h-5 mt-1" />
        </label>
        <label className="flex justify-between gap-4 cursor-pointer">
          <span>
            <strong className="text-[var(--ink)]">Nearby offers</strong>
            <small className="block text-[var(--muted)] mt-1">Occasional recommendations from local kitchens</small>
          </span>
          <input type="checkbox" checked={nearbyOffers} onChange={(e) => setNearbyOffers(e.target.checked)} className="accent-orange-500 w-5 h-5 mt-1" />
        </label>
        <button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 font-bold transition"
        >
          {saved ? '✓ Saved' : 'Save preferences'}
        </button>
      </div>
    </Shell>
  );
};
