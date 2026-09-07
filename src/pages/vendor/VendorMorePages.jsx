import { useEffect, useState } from 'react';
import { BarChart3, Bell, CheckCircle2, Save, Star, Store, Wallet } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { formatCurrency } from '../../utils/currency';

const VendorShell = ({ eyebrow, title, description, children }) => <div className="max-w-7xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">{eyebrow}</p><h1 className="text-3xl font-bold text-gray-900">{title}</h1>{description && <p className="text-gray-500 mt-2">{description}</p>}</div>{children}</div>;
const Metric = ({ label, value, icon: Icon }) => <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between"><div><p className="text-xs uppercase font-bold text-gray-400">{label}</p><p className="text-2xl font-bold mt-2">{value}</p></div><Icon className="text-orange-500" /></div>;

export const VendorAnalytics = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    vendorService.getAnalytics()
      .then((res) => setData(res?.data || res))
      .catch((err) => setError(err.message || 'Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <VendorShell eyebrow="Performance" title="Sales analytics" description="">
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[var(--line)] p-5 h-24 animate-pulse bg-[var(--canvas)]" />
        ))}
      </div>
    </VendorShell>
  );

  if (error) return (
    <VendorShell eyebrow="Performance" title="Sales analytics" description="">
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 text-sm">{error}</div>
    </VendorShell>
  );

  const chart   = data?.weeklyChart || [];
  const popular = data?.popularItems || [];
  const maxRev  = Math.max(...chart.map((d) => d.revenue), 1);

  return (
    <VendorShell eyebrow="Performance" title="Sales analytics" description="A clear view of your kitchen's momentum.">
      <div className="grid md:grid-cols-4 gap-4">
        <Metric label="Today's revenue"  value={formatCurrency(data?.todayRevenue)} icon={Wallet} />
        <Metric label="Total orders"     value={data?.totalOrders    || 0}                          icon={BarChart3} />
        <Metric label="Average rating"   value={`${Number(data?.averageRating || 0).toFixed(1)} ★`} icon={Star} />
        <Metric label="Completed"        value={data?.completedOrders || 0}                         icon={Store} />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        {/* Revenue bar chart */}
        <div className="bg-white rounded-3xl border border-[var(--line)] p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-bold text-[var(--ink)]">Revenue — last 7 days</h2>
            <span className="text-sm font-bold text-orange-500">{formatCurrency(data?.weekRevenue)}</span>
          </div>
          {chart.length > 0 ? (
            <div className="h-48 flex items-end gap-2">
              {chart.map((day) => {
                const pct = maxRev > 0 ? Math.max((day.revenue / maxRev) * 100, 4) : 4;
                return (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[0.6rem] text-[var(--muted)] font-semibold">{day.revenue > 0 ? formatCurrency(day.revenue) : ''}</span>
                    <div className="w-full relative" style={{ height: '8rem' }}>
                      <div
                        className="absolute bottom-0 inset-x-0 bg-orange-200 rounded-t-lg transition-all duration-500"
                        style={{ height: `${pct}%` }}
                      >
                        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-orange-500 rounded-t-lg" />
                      </div>
                    </div>
                    <span className="text-[0.65rem] text-[var(--muted)]">{day.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--muted)] text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Popular items */}
        <div className="bg-gray-900 text-white rounded-3xl p-6">
          <h2 className="font-bold mb-5">Popular this week</h2>
          {popular.length > 0 ? (
            popular.map((item, idx) => (
              <div key={item.name} className="flex justify-between py-3.5 border-b border-white/10 last:border-0 text-sm">
                <span className="text-gray-300">{idx + 1}. {item.name}</span>
                <strong className="text-white">{item.count} orders</strong>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 mt-3">Complete more orders to see popular items.</p>
          )}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase font-bold text-[var(--muted)]">This month</p>
          <p className="text-2xl font-bold text-[var(--ink)] mt-1">{formatCurrency(data?.monthRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase font-bold text-[var(--muted)]">Pending orders</p>
          <p className="text-2xl font-bold text-[var(--ink)] mt-1">{data?.pendingOrders || 0}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--line)] p-5">
          <p className="text-xs uppercase font-bold text-[var(--muted)]">Total revenue</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{formatCurrency(data?.totalRevenue)}</p>
        </div>
      </div>
    </VendorShell>
  );
};

export const VendorCustomers = () => <VendorShell eyebrow="Relationships" title="Customers" description="Understand the people returning to your kitchen."><div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"><div className="table-scroll"><div className="min-w-[32rem]"><div className="grid grid-cols-3 p-5 border-b text-xs uppercase font-bold text-gray-400"><span>Customer</span><span>Orders</span><span>Last order</span></div>{['Alex Johnson', 'Sarah Jenkins', 'Mike Ross', 'Emma Watson'].map((name, index) => <div key={name} className="grid grid-cols-3 p-5 border-b last:border-0 text-sm"><strong>{name}</strong><span>{[8, 5, 3, 2][index]} orders</span><span className="text-gray-500">{index + 1} days ago</span></div>)}</div></div></div></VendorShell>;

export const VendorPayouts = () => <VendorShell eyebrow="Money movement" title="Payouts" description="Track your balance, commissions, and upcoming transfers."><div className="grid md:grid-cols-3 gap-4"><Metric label="Available balance" value={formatCurrency(2840.60)} icon={Wallet} /><Metric label="This month" value={formatCurrency(8420.15)} icon={BarChart3} /><Metric label="Next payout" value="Friday" icon={CheckCircle2} /></div><div className="bg-white rounded-3xl border border-gray-100 p-6"><h2 className="font-bold mb-4">Recent transfers</h2>{[{ date: 'Aug 16', amount: 1248.50 }, { date: 'Aug 09', amount: 1086.20 }, { date: 'Aug 02', amount: 945.85 }].map((row) => <div key={row.date} className="flex justify-between py-4 border-b last:border-0 text-sm"><span>{row.date} · {formatCurrency(row.amount)}</span><span className="text-green-600 font-bold">Paid</span></div>)}</div></VendorShell>;

export const VendorNotifications = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.getNotifications()
      .then((res) => setItems(Array.isArray(res) ? res : res?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <VendorShell eyebrow="Stay in sync" title="Notifications" description="Operational updates for your restaurant.">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--line)] p-5 h-16 animate-pulse bg-[var(--canvas)]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[var(--line)] p-10 text-center text-[var(--muted)]">
          <Bell className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n._id || n.id} className={`bg-white rounded-2xl border border-[var(--line)] p-5 flex gap-4 ${!n.read ? 'border-l-4 border-l-orange-400' : ''}`}>
              <Bell className="text-orange-500 shrink-0" />
              <div className="min-w-0">
                <strong className="text-[var(--ink)] block truncate">{n.title}</strong>
                <p className="text-sm text-[var(--muted)] mt-0.5">{n.message}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recently'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </VendorShell>
  );
};

export const VendorSettings = () => { const [saved, setSaved] = useState(false); return <VendorShell eyebrow="Workspace" title="Restaurant settings" description="Keep your public restaurant details accurate."><form onSubmit={(event) => { event.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 1400); }} className="max-w-2xl bg-white rounded-3xl border border-gray-100 p-6 space-y-5"><label className="block font-semibold">Restaurant name<input defaultValue="Artisan Burger Co." className="w-full mt-2 p-3 border rounded-xl font-normal" /></label><label className="block font-semibold">Description<textarea defaultValue="Small-batch burgers, crisp fries, and house-made sauces." className="w-full mt-2 p-3 border rounded-xl font-normal" rows="3" /></label><label className="flex justify-between"><span className="font-semibold">Accepting orders</span><input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" /></label><button className="bg-orange-500 text-white rounded-xl px-5 py-3 font-bold flex gap-2"><Save className="w-4 h-4" /> {saved ? 'Saved' : 'Save settings'}</button></form></VendorShell>; };
