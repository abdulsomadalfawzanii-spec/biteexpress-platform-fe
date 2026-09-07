import { useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/currency';

export const AdminDashboard = () => {
  const { users = [], metrics = {}, updateUser } = usePlatform();

  const moderationRows = useMemo(() => users.slice(0, 8), [users]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await adminService.updateUserStatus(userId, nextStatus);
    updateUser(userId, { accountStatus: nextStatus, status: nextStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">System Platform Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Gross Platform Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.totalGrossRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Platform Commission</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{formatCurrency(metrics.platformCommissionEarned)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Registered Customers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase">Active Vendors</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.totalVendors || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-900">User Moderation & Vendor Approval</div>
        <div className="table-scroll"><table className="w-full min-w-[40rem] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-400 uppercase">
              <th className="p-4">Entity</th>
              <th className="p-4">Role Designation</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {moderationRows.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                <td className="p-4 text-gray-500 capitalize">{u.role}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleToggleUserStatus(u.id, u.status)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-semibold">
                    {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
};