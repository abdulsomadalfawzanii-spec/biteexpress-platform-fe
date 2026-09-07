import { useEffect, useState } from 'react';
import { Award, Bike, CheckCircle2, Loader2, Save, Star, Wallet } from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import { formatCurrency } from '../../utils/currency';

const DeliveryShell = ({ eyebrow, title, description, children }) => (
  <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
    {children}
  </div>
);

const Metric = ({ label, value, icon: Icon, dark = false }) => (
  <div className={`rounded-2xl border p-5 ${dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-[var(--line)]'}`}>
    <Icon className={`mb-4 ${dark ? 'text-orange-300' : 'text-orange-500'}`} />
    <p className={`text-xs uppercase font-bold ${dark ? 'text-gray-400' : 'text-[var(--muted)]'}`}>{label}</p>
    <p className={`text-2xl font-bold mt-1 ${dark ? 'text-white' : 'text-[var(--ink)]'}`}>{value}</p>
  </div>
);

/* ── DeliveryEarnings ─────────────────────────────── */
export const DeliveryEarnings = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    deliveryService.getEarnings()
      .then((res) => setData(res?.data || res))
      .catch((err) => setError(err.message || 'Failed to load earnings.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DeliveryShell eyebrow="Your money" title="Earnings" description="">
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-[var(--line)] h-28 animate-pulse" />)}
      </div>
    </DeliveryShell>
  );

  return (
    <DeliveryShell eyebrow="Your money" title="Earnings" description="Keep track of completed work and upcoming payouts.">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        <Metric label="Today"       value={formatCurrency(data?.todayEarnings)} icon={Wallet} dark />
        <Metric label="This week"   value={formatCurrency(data?.weekEarnings)} icon={Bike} />
        <Metric label="Deliveries"  value={data?.totalDeliveries || 0}                          icon={CheckCircle2} />
      </div>

      <div className="bg-white rounded-3xl border border-[var(--line)] p-6">
        <h2 className="font-bold text-[var(--ink)] mb-4">Recent deliveries</h2>
        {(!data?.deliveries || data.deliveries.length === 0) ? (
          <p className="text-sm text-[var(--muted)] text-center py-6">No completed deliveries yet.</p>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {data.deliveries.slice(0, 15).map((d, i) => (
              <div key={d.orderId || i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--ink)] text-sm truncate">{d.vendorName}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5 truncate">{d.deliveryAddress}</p>
                  <p className="text-xs text-[var(--muted)]">{d.completedAt ? new Date(d.completedAt).toLocaleDateString() : '—'}</p>
                </div>
                <span className="font-bold text-emerald-600 shrink-0">+{formatCurrency(d.earnings)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DeliveryShell>
  );
};

/* ── DeliveryPerformance ──────────────────────────── */
export const DeliveryPerformance = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryService.getEarnings()
      .then((res) => setData(res?.data || res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const rating    = data?.rating    ?? 0;
  const delivered = data?.totalDeliveries ?? 0;

  return (
    <DeliveryShell eyebrow="Your performance" title="Performance" description="Small details that make every delivery better.">
      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-[var(--line)] h-28 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Metric label="Customer rating"      value={rating > 0 ? `${Number(rating).toFixed(1)} / 5` : '—'} icon={Star} />
            <Metric label="Completed deliveries" value={delivered}                                               icon={CheckCircle2} />
            <Metric label="Total earnings"        value={formatCurrency(data?.totalEarnings)}     icon={Award} />
          </div>

          <div className="bg-gray-900 text-white rounded-3xl p-6">
            <h2 className="font-bold mb-5">Keep it up</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {['Timely pickups', 'Careful handling', 'Friendly handoff'].map((item) => (
                <div key={item} className="p-4 rounded-2xl bg-white/10 text-sm">{item}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </DeliveryShell>
  );
};

/* ── DeliveryRatings ──────────────────────────────── */
export const DeliveryRatings = () => (
  <DeliveryShell eyebrow="Customer feedback" title="Ratings" description="See what customers appreciate about your work.">
    <div className="bg-white rounded-3xl border border-[var(--line)] p-6 space-y-4">
      {['Great communication and quick delivery.', 'Very friendly at the door.', 'Food arrived exactly as expected.'].map((text) => (
        <article key={text} className="p-4 rounded-2xl bg-[var(--canvas)]">
          <div className="flex gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <p className="text-sm mt-2 text-[var(--muted)]">{text}</p>
        </article>
      ))}
    </div>
  </DeliveryShell>
);

/* ── DeliveryProfile ──────────────────────────────── */
export const DeliveryProfile = () => {
  const [form, setForm] = useState({
    name: '', phone: '', vehicleType: 'Car', licensePlate: '', vehicleModel: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [saveErr, setSaveErr] = useState('');

  useEffect(() => {
    deliveryService.getProfile()
      .then((res) => {
        const p = res?.data || res || {};
        setForm({
          name:         p.user?.name       || '',
          phone:        p.phone            || '',
          vehicleType:  p.vehicleDetails?.vehicleType  || 'Car',
          licensePlate: p.vehicleDetails?.licensePlate || '',
          vehicleModel: p.vehicleDetails?.model        || '',
        });
      })
      .catch((err) => setError(err.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaved(false); setSaveErr('');
    try {
      await deliveryService.updateProfile({
        phone: form.phone.trim(),
        vehicleDetails: {
          vehicleType:  form.vehicleType,
          licensePlate: form.licensePlate.trim(),
          model:        form.vehicleModel.trim(),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveErr(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DeliveryShell eyebrow="Your profile" title="Delivery profile" description="">
      <div className="max-w-2xl bg-white rounded-3xl border border-[var(--line)] p-6 space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-[var(--canvas)] rounded-xl" />)}
      </div>
    </DeliveryShell>
  );

  return (
    <DeliveryShell eyebrow="Your profile" title="Delivery profile" description="Keep your contact and vehicle details current.">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm max-w-2xl">{error}</div>}

      <form onSubmit={handleSave} className="max-w-2xl bg-white rounded-3xl border border-[var(--line)] p-6 space-y-5">
        <label className="block font-semibold text-[var(--ink)] text-sm">
          Full name
          <input
            value={form.name}
            disabled
            className="w-full mt-2 p-3 border border-[var(--line)] rounded-xl font-normal text-sm bg-[var(--canvas)] text-[var(--muted)] cursor-not-allowed"
          />
          <span className="text-xs font-normal text-[var(--muted)] mt-1 block">Name is managed through your account.</span>
        </label>

        <label className="block font-semibold text-[var(--ink)] text-sm">
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="w-full mt-2 p-3 border border-[var(--line)] rounded-xl font-normal text-sm focus:outline-none focus:border-orange-400"
          />
        </label>

        <label className="block font-semibold text-[var(--ink)] text-sm">
          Vehicle type
          <select
            value={form.vehicleType}
            onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
            className="w-full mt-2 p-3 border border-[var(--line)] rounded-xl font-normal text-sm focus:outline-none focus:border-orange-400"
          >
            {['Bicycle', 'Motorcycle', 'Scooter', 'Car', 'Van'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block font-semibold text-[var(--ink)] text-sm">
            License plate
            <input
              value={form.licensePlate}
              onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
              placeholder="ABC-1234"
              className="w-full mt-2 p-3 border border-[var(--line)] rounded-xl font-normal text-sm focus:outline-none focus:border-orange-400"
            />
          </label>
          <label className="block font-semibold text-[var(--ink)] text-sm">
            Vehicle model
            <input
              value={form.vehicleModel}
              onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
              placeholder="Toyota Corolla"
              className="w-full mt-2 p-3 border border-[var(--line)] rounded-xl font-normal text-sm focus:outline-none focus:border-orange-400"
            />
          </label>
        </div>

        {saveErr && <p className="text-sm text-red-600">{saveErr}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 font-bold flex items-center gap-2 transition disabled:opacity-60"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : saved ? '✓ Saved' : <><Save className="w-4 h-4" />Save profile</>}
        </button>
      </form>
    </DeliveryShell>
  );
};
