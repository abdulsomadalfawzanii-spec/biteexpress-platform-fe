import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Save, ShieldCheck, UserRound, Loader2, CheckCircle2, Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { apiRequest } from '../../services/api';
import { formatCurrency } from '../../utils/currency';

export const CustomerAccount = () => {
  const { user, setUser } = useAuth();
  const [form, setForm]   = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState('');

  // Sync form when user changes (e.g. after auth refresh)
  useEffect(() => {
    queueMicrotask(() => setForm({
      name:    user?.name    || '',
      email:   user?.email   || '',
      phone:   user?.phone   || '',
      address: user?.address || '',
    }));
  }, [user?.id, user?.name, user?.email, user?.phone, user?.address]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setSaved(false); setSaveErr('');
    try {
      const updated = await apiRequest('/customer/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name:    form.name.trim(),
          phone:   form.phone.trim(),
          address: form.address.trim(),
        }),
      });
      // Persist updated name into auth context/localStorage
      setUser({ ...user, name: updated?.name || form.name, phone: updated?.phone || form.phone, address: updated?.address || form.address });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveErr(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="eyebrow">Your BiteExpress</p>
        <h1 className="page-title">Account &amp; preferences</h1>
        <p className="page-description">Keep your details ready for the next good meal.</p>
      </div>

      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-gray-900 rounded-3xl p-6 text-white space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <UserRound className="w-8 h-8 text-orange-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold truncate">{user?.name || 'Your Account'}</p>
              <p className="text-sm text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/account" className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 text-sm font-semibold">
              Profile settings <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/orders" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition">
              Order history <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/favorites" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition">
              Favorite kitchens <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/reviews" className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition">
              My reviews <ChevronRight className="w-4 h-4" />
            </Link>
          </nav>

          <div className="border-t border-white/10 pt-5 text-sm text-gray-400 flex gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
            Your account is protected.
          </div>
        </aside>

        {/* Form */}
        <form onSubmit={saveProfile} className="bg-white rounded-3xl border border-[var(--line)] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">Personal details</h2>
              <p className="text-sm text-[var(--muted)] mt-1">Used for receipts and delivery updates.</p>
            </div>
            <UserRound className="w-6 h-6 text-orange-500" />
          </div>

          <label className="block text-sm font-semibold text-[var(--ink)]">
            Full name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-semibold text-[var(--ink)]">
            Email address
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm bg-[var(--canvas)] text-[var(--muted)] cursor-not-allowed"
            />
            <span className="text-xs text-[var(--muted)] mt-1 block">Email cannot be changed here.</span>
          </label>

          <label className="block text-sm font-semibold text-[var(--ink)]">
            Phone number
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400"
            />
          </label>

          <label className="block text-sm font-semibold text-[var(--ink)]">
            Default delivery address
            <span className="relative block">
              <MapPin className="absolute left-3 top-[1.1rem] w-4 h-4 text-orange-500" />
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, City, State"
                className="w-full mt-2 pl-9 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400"
              />
            </span>
          </label>

          {saveErr && <p className="text-sm text-red-600">{saveErr}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 font-bold flex items-center gap-2 transition disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle2 className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ── OrderHistory ─────────────────────────────────── */
export const OrderHistory = () => {
  const { orders } = usePlatform();

  const statusColor = {
    pending:          'bg-yellow-50 text-yellow-700',
    confirmed:        'bg-blue-50 text-blue-700',
    preparing:        'bg-orange-50 text-orange-700',
    ready_for_pickup: 'bg-purple-50 text-purple-700',
    assigned:         'bg-indigo-50 text-indigo-700',
    picked_up:        'bg-sky-50 text-sky-700',
    on_the_way:       'bg-cyan-50 text-cyan-700',
    delivered:        'bg-emerald-50 text-emerald-700',
    cancelled:        'bg-red-50 text-red-600',
    rejected:         'bg-red-50 text-red-600',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <p className="eyebrow">Receipts &amp; reorder</p>
        <h1 className="page-title">Order history</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[var(--line)] p-12 text-center">
          <Pencil className="w-10 h-10 text-[var(--orange)] mx-auto mb-3 opacity-50" />
          <p className="font-bold text-[var(--ink)]">No orders yet</p>
          <p className="text-sm text-[var(--muted)] mt-1">Your order history will appear here.</p>
          <Link to="/restaurants" className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
            Browse restaurants
          </Link>
        </div>
      ) : (
        orders.map((order) => {
          const s = order.orderStatus || order.status || 'pending';
          return (
            <article key={order.id} className="bg-white rounded-2xl border border-[var(--line)] p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[var(--shadow-soft)]">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-[var(--ink)]">
                    #{String(order.id || '').slice(-8).toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[s] || 'bg-gray-50 text-gray-600'}`}>
                    {s.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] mt-2">{order.vendorName} · {order.createdAt}</p>
                {order.items?.length > 0 && (
                  <p className="text-sm text-[var(--muted)] mt-1 truncate">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xl font-bold text-orange-500">{formatCurrency(order.total)}</span>
                <Link
                  to={`/orders/${order.id}`}
                  className="p-2.5 rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-orange-500 hover:border-orange-300 transition"
                  title="View details"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
};
