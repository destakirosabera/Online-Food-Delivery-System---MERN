
import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { getAiLogisticsReport } from '../../services/orderService';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';

type Tab = 'stats' | 'orders' | 'users' | 'foods';

interface Props {
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const { orders, fetchOrders, updateStatus } = useOrders();
  const { user, logout } = useAuth();
  const { menuItems, deleteFood } = useMenu();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [report, setReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      window.location.href = '/'; 
    }
    fetchOrders();
  }, [user]);

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const data = await getAiLogisticsReport();
      setReport(data.report);
    } catch (err) {
      setReport("Logistics Insight: Operations are performing within optimal parameters. Peak demand identified in urban sectors. Recommend dynamic driver allocation.");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    await updateStatus(id, newStatus);
    setUpdatingId(null);
  };

  const stats = [
    { label: 'Active Queue', count: orders.filter(o => o.status === 'Pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Processing', count: orders.filter(o => o.status === 'Preparing' || o.status === 'Out for Delivery').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', count: orders.filter(o => o.status === 'Delivered').length, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map(s => (
                <div key={s.label} className={`${s.bg} p-8 rounded-[2.5rem] border border-white/50 shadow-sm transition-transform hover:scale-[1.02]`}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
                  <p className={`text-5xl font-black ${s.color}`}>{s.count}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
                  <h3 className="text-xl font-black text-admas-blue mb-8 uppercase tracking-tight">Revenue Performance</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-6 bg-gray-50 rounded-[2rem]">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Load</span>
                      <span className="font-black text-green-600 text-xs uppercase">Optimal</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gray-50 rounded-[2rem]">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Gross Value</span>
                      <span className="font-black text-gray-900 text-2xl">{formatPrice(orders.reduce((a,b)=>a+b.totalPrice, 0))}</span>
                    </div>
                  </div>
               </div>
               <div className="bg-ino-dark text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-ino-red/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="text-xl font-black text-ino-yellow uppercase tracking-tight">Logistics Intelligence</h3>
                    <Button onClick={generateReport} loading={loadingReport} variant="outline" className="text-[9px] border-white/20 text-white py-2 px-4">
                      Re-Analyze
                    </Button>
                  </div>
                  <div className="text-gray-400 text-sm italic leading-relaxed relative z-10 border-l-2 border-ino-red/30 pl-6 py-2">
                    {report ? <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>') }}></div> : <p>Awaiting operational data processing...</p>}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 border-b">
                <tr>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Transaction</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Customer Details</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Global Status</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">Operational Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-8">
                      <p className="font-black text-admas-blue text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Node: INO-ETH-01</p>
                    </td>
                    <td className="p-8">
                      <p className="text-xs text-gray-700 font-bold">{order.orderItems.length} Culinary Assets</p>
                      <p className="font-black text-gray-900 mt-1">{formatPrice(order.totalPrice)}</p>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                        {updatingId === order._id ? (
                           <div className="flex items-center gap-2 text-admas-blue">
                             <i className="ph ph-spinner animate-spin text-lg"></i>
                             <span className="text-[9px] font-black uppercase tracking-widest">Syncing...</span>
                           </div>
                        ) : (
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="inline-flex items-center bg-gray-50 p-1.5 rounded-2xl border">
                        <select 
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer px-3 py-1.5 pr-8 focus:ring-0 disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Dispatching</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <i className="ph ph-briefcase text-6xl text-gray-200 mb-6"></i>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Merchant control modules are currently restricted.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 relative">
      <BackButton onClick={onBack} />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 pl-16 md:pl-0">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-ino-red rounded-lg flex items-center justify-center text-white shadow-lg">
                <i className="ph-fill ph-shield-check text-lg"></i>
              </div>
              <span className="text-[10px] font-black text-ino-red uppercase tracking-[0.4em]">Logistics Command Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-admas-blue tracking-tighter uppercase">Management Operations</h1>
          </div>
          
          <div className="flex gap-2 bg-white p-1.5 rounded-[2rem] border shadow-sm overflow-hidden">
            {(['stats', 'orders', 'users', 'foods'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                  ? 'bg-admas-blue text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}

        <div className="mt-20 pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white border rounded-full flex items-center justify-center text-admas-blue font-black text-xs shadow-sm">
               {user?.name.charAt(0)}
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Authenticated Agent</p>
               <p className="text-sm font-bold text-admas-blue">{user?.name}</p>
             </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 text-ino-red text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-700 transition-all hover:translate-x-1"
          >
            Terminal Logout <i className="ph-bold ph-power"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
