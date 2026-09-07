import { useEffect, useState } from 'react';
import { BarChart3, DollarSign, Loader2, MessageSquare, Store, Wallet } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { vendorService } from '../../services/vendorService';
import { formatCurrency } from '../../utils/currency';

export const VendorProfile = () => {
  const [form, setForm] = useState({
    restaurantName: '', description: '', phone: '',
    address: '', cuisineTypes: '', openTime: '11:00', closeTime: '22:00',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [saveErr, setSaveErr] = useState('');

  useEffect(() => {
    vendorService.getProfile()
      .then((data) => {
        const p = data?.data || data || {};
        setForm({
          restaurantName: p.restaurantName || '',
          description:    p.description    || '',
          phone:          p.phone          || '',
          address:        p.address        || '',
          cuisineTypes:   Array.isArray(p.cuisineTypes) ? p.cuisineTypes.join(', ') : (p.cuisineTypes || ''),
          openTime:       p.operatingHours?.open  || '11:00',
          closeTime:      p.operatingHours?.close || '22:00',
        });
      })
      .catch((err) => setError(err.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaved(false); setSaveErr('');
    try {
      await vendorService.updateProfile({
        restaurantName: form.restaurantName.trim(),
        description:    form.description.trim(),
        phone:          form.phone.trim(),
        address:        form.address.trim(),
        cuisineTypes:   form.cuisineTypes.split(',').map((s) => s.trim()).filter(Boolean),
        operatingHours: { open: form.openTime, close: form.closeTime },
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-[var(--line)] p-8 animate-pulse space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-[var(--canvas)] rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="eyebrow">Restaurant profile</p>
        <h1 className="page-title">Your kitchen identity</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[var(--line)] p-6 md:p-8 grid md:grid-cols-2 gap-5">
        <label className="block text-sm font-bold text-[var(--ink)]">
          Restaurant name *
          <input required value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400" />
        </label>

        <label className="block text-sm font-bold text-[var(--ink)]">
          Cuisine types
          <input value={form.cuisineTypes} onChange={(e) => setForm({ ...form, cuisineTypes: e.target.value })} placeholder="e.g. Burgers, American, Grill" className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400" />
          <span className="text-xs font-normal text-[var(--muted)] mt-1 block">Separate with commas.</span>
        </label>

        <label className="block text-sm font-bold text-[var(--ink)] md:col-span-2">
          Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe your restaurant…" className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400 resize-none" />
        </label>

        <label className="block text-sm font-bold text-[var(--ink)]">
          Phone number
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400" />
        </label>

        <label className="block text-sm font-bold text-[var(--ink)]">
          Address
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Restaurant Row, City" className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400" />
        </label>

        <label className="block text-sm font-bold text-[var(--ink)]">
          Opening time
          <input type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400" />
        </label>

        <label className="block text-sm font-bold text-[var(--ink)]">
          Closing time
          <input type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} className="w-full mt-2 p-3 rounded-xl border border-[var(--line)] font-normal text-sm focus:outline-none focus:border-orange-400" />
        </label>

        {saveErr && <p className="md:col-span-2 text-sm text-red-600">{saveErr}</p>}

        <button
          type="submit"
          disabled={saving}
          className="md:col-span-2 w-fit bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 font-bold flex items-center gap-2 transition disabled:opacity-60"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : saved ? '✓ Profile saved' : 'Save restaurant profile'}
        </button>
      </form>
    </div>
  );
};

export const VendorFinance = () => {
  const { orders } = usePlatform();
  const completed = orders.filter((order) => order.status === 'Delivered');
  const revenue = completed.reduce((sum, order) => sum + order.total, 0);
  return <div className="max-w-6xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">Money & performance</p><h1 className="text-3xl font-bold text-gray-900">Sales and payouts</h1></div><div className="grid md:grid-cols-3 gap-5"><Metric icon={<DollarSign />} label="Available balance" value={formatCurrency(revenue * 0.85 + 1248.5)} /><Metric icon={<BarChart3 />} label="This month's sales" value={formatCurrency(revenue + 4820)} /><Metric icon={<Wallet />} label="Next payout" value="Friday, Aug 22" /></div><div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6"><div className="bg-white rounded-3xl border border-gray-100 p-6"><h2 className="font-bold text-gray-900 mb-5">Payout history</h2>{['Aug 15, 2026', 'Aug 08, 2026', 'Aug 01, 2026'].map((date, index) => <div key={date} className="flex justify-between py-4 border-b border-gray-100 last:border-0"><span className="text-sm text-gray-500">{date} · Stripe transfer</span><span className="font-bold text-green-600">+{formatCurrency([1248.50, 986.20, 1104.80][index])}</span></div>)}</div><div className="bg-gray-900 rounded-3xl p-6 text-white"><Store className="text-orange-300 w-7 h-7 mb-6" /><h2 className="font-bold text-xl">Platform commission</h2><p className="text-gray-400 text-sm mt-2">Your current platform rate is 15%. Payouts are released after successful delivery.</p><div className="mt-8 text-4xl font-bold">15<span className="text-orange-300">%</span></div></div></div></div>;
};

const Metric = ({ icon, label, value }) => <div className="bg-white rounded-2xl border border-gray-100 p-5"><div className="flex justify-between"><span className="text-orange-500">{icon}</span><span className="text-xs uppercase text-gray-400 font-bold">Live</span></div><p className="text-xs text-gray-500 mt-6">{label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{value}</p></div>;

export const VendorReviews = () => {
  const { reviews } = usePlatform();
  return <div className="max-w-5xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">Customer voice</p><h1 className="text-3xl font-bold text-gray-900">Ratings and reviews</h1></div><div className="bg-gray-900 rounded-3xl p-7 text-white flex items-center justify-between"><div><p className="text-gray-400 text-sm">Overall restaurant rating</p><p className="text-5xl font-bold mt-2">4.8</p></div><MessageSquare className="w-12 h-12 text-orange-300" /></div><div className="space-y-4">{reviews.map((review) => <article key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5"><div className="flex justify-between"><span className="font-bold text-gray-900">{review.customer}</span><span className="text-amber-500">{'★'.repeat(review.rating)}</span></div><p className="text-gray-600 mt-3">{review.text}</p><p className="text-xs text-gray-400 mt-3">{review.date}</p></article>)}</div></div>;
};
