import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, Download, FileText, Settings, Store, Wallet } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/currency';

const AdminShell = ({ eyebrow, title, description, children }) => <div className="max-w-7xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">{eyebrow}</p><h1 className="text-3xl font-bold text-gray-900">{title}</h1>{description && <p className="text-gray-500 mt-2">{description}</p>}</div>{children}</div>;
const Metric = ({ label, value, icon: Icon }) => <div className="bg-white rounded-2xl border border-gray-100 p-5"><Icon className="w-5 h-5 text-orange-500 mb-5" /><p className="text-xs uppercase font-bold text-gray-400">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>;
export const AdminUsers = () => { const { users = [] } = usePlatform(); return <AdminShell eyebrow="Platform directory" title="Users" description="Manage every account across the marketplace."><div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"><div className="table-scroll"><div className="min-w-[40rem]"><div className="grid grid-cols-4 gap-4 p-5 border-b text-xs uppercase font-bold text-gray-400"><span>Name</span><span>Email</span><span>Role</span><span>Status</span></div>{users.map((user) => <div key={user.id} className="grid grid-cols-4 gap-4 p-5 border-b last:border-0 text-sm items-center"><strong>{user.name}</strong><span className="text-gray-500 truncate">{user.email}</span><span className="capitalize">{user.role}</span><span className="text-green-600 font-bold">{user.status}</span></div>)}</div></div></div></AdminShell>; };
export const AdminVendors = () => {
  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    adminService.getVendors()
      .then((res) => setVendors(Array.isArray(res) ? res : res?.data || []))
      .catch((err) => setError(err.message || 'Failed to load vendors.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleApproval = async (vendorId, status) => {
    setUpdating(vendorId);
    try {
      await adminService.updateVendorApproval(vendorId, status);
      setVendors((prev) => prev.map((v) =>
        String(v._id || v.id) === String(vendorId)
          ? { ...v, approvalStatus: status, isApproved: status === 'approved' }
          : v
      ));
    } catch (err) {
      alert(err.message || 'Failed to update vendor.');
    } finally {
      setUpdating(null);
    }
  };

  const approved = vendors.filter((v) => v.approvalStatus === 'approved').length;
  const pending  = vendors.filter((v) => v.approvalStatus === 'pending').length;
  const rejected = vendors.filter((v) => v.approvalStatus === 'rejected').length;

  return (
    <AdminShell eyebrow="Marketplace health" title="Vendors & approvals" description="Review restaurants and manage their operating status.">
      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl border border-[var(--line)] h-24 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Metric label="Active vendors"    value={approved} icon={Store} />
            <Metric label="Pending approval"  value={pending}  icon={CheckCircle2} />
            <Metric label="Rejected"          value={rejected} icon={BarChart3} />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

          <div className="bg-white rounded-3xl border border-[var(--line)] overflow-hidden">
            <div className="p-5 border-b border-[var(--line)] font-bold text-[var(--ink)]">All restaurants ({vendors.length})</div>
            {vendors.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">No vendors registered yet.</div>
            ) : (
              <div className="divide-y divide-[var(--line)]">
                {vendors.map((v) => {
                  const vid    = String(v._id || v.id);
                  const status = v.approvalStatus || 'pending';
                  const statusColor = { approved: 'text-emerald-600', pending: 'text-yellow-600', rejected: 'text-red-600' };
                  return (
                    <div key={vid} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                      <div className="min-w-0">
                        <strong className="text-[var(--ink)] block truncate">{v.restaurantName}</strong>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {v.user?.name || v.user?.email || '—'} · {v.cuisineTypes?.join(', ') || '—'}
                        </p>
                        <span className={`text-xs font-bold capitalize ${statusColor[status] || 'text-gray-500'}`}>{status}</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {status !== 'approved' && (
                          <button
                            disabled={updating === vid}
                            onClick={() => handleApproval(vid, 'approved')}
                            className="text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            {updating === vid ? '…' : 'Approve'}
                          </button>
                        )}
                        {status !== 'rejected' && (
                          <button
                            disabled={updating === vid}
                            onClick={() => handleApproval(vid, 'rejected')}
                            className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            {updating === vid ? '…' : 'Reject'}
                          </button>
                        )}
                        {status !== 'pending' && (
                          <button
                            disabled={updating === vid}
                            onClick={() => handleApproval(vid, 'pending')}
                            className="text-xs font-bold bg-[var(--canvas)] hover:bg-gray-100 text-[var(--muted)] px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
};
export const AdminTransactions = () => {
  const { metrics } = usePlatform();
  const gross      = Number(metrics?.totalGrossRevenue      || 0);
  const commission = Number(metrics?.platformCommissionEarned || 0);
  const settled    = gross - commission;
  const recent     = Array.isArray(metrics?.recentOrders) ? metrics.recentOrders : [];

  return (
    <AdminShell eyebrow="Finance" title="Transactions & commissions" description="Monitor payment flow and platform earnings.">
      <div className="grid md:grid-cols-3 gap-4">
        <Metric label="Gross volume"  value={formatCurrency(gross)}      icon={Wallet} />
        <Metric label="Commission"    value={formatCurrency(commission)}  icon={BarChart3} />
        <Metric label="Net to vendors" value={formatCurrency(settled)}   icon={CheckCircle2} />
      </div>

      <div className="bg-white rounded-3xl border border-[var(--line)] p-6">
        <h2 className="font-bold text-[var(--ink)] mb-4">
          Recent transactions
          {metrics?.paidOrders != null && (
            <span className="text-xs font-normal text-[var(--muted)] ml-2">({metrics.paidOrders} paid orders)</span>
          )}
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-[var(--muted)] py-4 text-center">No paid transactions yet.</p>
        ) : (
          recent.map((order) => (
            <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 border-b border-[var(--line)] last:border-0 text-sm">
              <div>
                <span className="font-semibold text-[var(--ink)]">#{String(order._id).slice(-8).toUpperCase()}</span>
                <span className="text-[var(--muted)] ml-2">
                  {order.vendor?.restaurantName || '—'} · {order.customer?.name || '—'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[var(--ink)]">{formatCurrency(order.total)}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                  {order.orderStatus?.replace(/_/g, ' ') || 'pending'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
};
export const AdminReports = () => <AdminShell eyebrow="Insights" title="Reports" description="Download operational summaries for the platform team."><div className="grid md:grid-cols-3 gap-4">{['Revenue report', 'Order performance', 'Vendor settlement'].map((report) => <button key={report} className="bg-white rounded-2xl border border-gray-100 p-6 text-left hover:border-orange-300"><FileText className="text-orange-500 mb-5" /><strong>{report}</strong><span className="flex items-center gap-2 text-sm text-orange-500 font-bold mt-4">Download <Download className="w-4 h-4" /></span></button>)}</div></AdminShell>;
export const AdminNotifications = () => <AdminShell eyebrow="Operations" title="Notifications" description="System alerts and approval reminders."><div className="space-y-3">{['4 vendors are awaiting approval', 'Daily revenue report is ready', 'Payment provider health is normal'].map((text) => <div key={text} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4"><Settings className="text-orange-500" /><div><strong>{text}</strong><p className="text-sm text-gray-500 mt-1">Today</p></div></div>)}</div></AdminShell>;
