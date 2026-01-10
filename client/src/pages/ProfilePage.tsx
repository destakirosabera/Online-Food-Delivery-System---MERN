
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
  onNavigate: (page: any) => void;
}

const ProfilePage: React.FC<Props> = ({ onBack, onNavigate }) => {
  const { user, updateUser, updatePassword } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passForm, setPassForm] = useState({ new: '', confirm: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const userOrders = orders.filter(o => o.user === user?.id || (o as any).user?._id === user?.id);

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser(user.id, formData);
    showToast('Info updated', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (passForm.new !== passForm.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (passForm.new.length < 8) {
      showToast('Password must be 8+ characters', 'error');
      return;
    }

    updatePassword(user.id, passForm.new);
    showToast('Password changed', 'success');
    setPassForm({ new: '', confirm: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen bg-white dark:bg-ino-dark transition-colors duration-300 relative">
      <BackButton onClick={onBack} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-12">
        <div className="xl:col-span-1 space-y-12">
            {/* USER INFO FORM */}
            <section className="bg-gray-50 dark:bg-gray-800/50 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300">
                <form onSubmit={handleUpdateInfo} className="space-y-6">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Your Name</label>
                       <input 
                         type="text" 
                         className="w-full p-5 rounded-2xl bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 border text-xs font-bold text-black dark:text-white outline-none focus:ring-2 ring-ino-red/10 transition-all" 
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})} 
                         placeholder="Name" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Your Email</label>
                       <input 
                         type="email" 
                         className="w-full p-5 rounded-2xl bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 border text-xs font-bold text-black dark:text-white outline-none focus:ring-2 ring-ino-red/10 transition-all" 
                         value={formData.email} 
                         onChange={e => setFormData({...formData, email: e.target.value})} 
                         placeholder="Email" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-gray-400 uppercase ml-4">Your Phone</label>
                       <input 
                         type="text" 
                         className="w-full p-5 rounded-2xl bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 border text-xs font-bold text-black dark:text-white outline-none focus:ring-2 ring-ino-red/10 transition-all" 
                         value={formData.phone} 
                         onChange={e => setFormData({...formData, phone: e.target.value})} 
                         placeholder="Phone" 
                       />
                    </div>
                    <Button type="submit" className="w-full py-5 rounded-3xl text-[10px] font-black uppercase shadow-xl tracking-widest bg-ino-red text-white">
                      change info
                    </Button>
                </form>
            </section>

            {/* PASSWORD SECTION */}
            <section className="bg-ino-dark text-white p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="ph-fill ph-lock-key text-8xl"></i></div>
                <h3 className="text-[10px] font-black uppercase text-ino-yellow mb-10 tracking-widest flex items-center gap-2">
                   Change New Password
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-500 uppercase ml-4">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-5 rounded-2xl bg-gray-900 border border-white/5 text-xs font-bold text-white outline-none focus:ring-1 ring-ino-red" 
                        required 
                        value={passForm.new} 
                        onChange={e => setPassForm({...passForm, new: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-500 uppercase ml-4">Verify Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-5 rounded-2xl bg-gray-900 border border-white/5 text-xs font-bold text-white outline-none focus:ring-1 ring-ino-red" 
                        required 
                        value={passForm.confirm} 
                        onChange={e => setPassForm({...passForm, confirm: e.target.value})} 
                      />
                    </div>
                    <Button type="submit" className="w-full py-5 rounded-3xl text-[10px] font-black uppercase bg-white text-ino-dark hover:bg-ino-yellow transition-all tracking-[0.2em]">
                      change info
                    </Button>
                </form>
            </section>
        </div>

        {/* HISTORY SECTION */}
        <div className="xl:col-span-2 space-y-8">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">history</h3>
            <div className="space-y-6">
                {userOrders.length === 0 ? (
                   <div className="bg-gray-50 dark:bg-gray-800/20 p-24 rounded-[4rem] text-center border-2 border-dashed border-gray-100 dark:border-gray-800">
                      <i className="ph ph-receipt text-6xl text-gray-200 dark:text-gray-700 mb-6"></i>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No active or history detected</p>
                      <Button variant="outline" className="mt-8 mx-auto" onClick={() => onNavigate('menu')}>Start Order</Button>
                   </div>
                ) : (
                  userOrders.map(order => (
                    <div key={order._id} className="bg-white dark:bg-gray-800 p-8 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center group hover:shadow-2xl transition-all duration-500 border-l-4 border-l-ino-red">
                       <div className="flex items-center gap-8 w-full md:w-auto">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center font-mono text-[10px] font-black text-gray-400 group-hover:bg-ino-red group-hover:text-white transition-all duration-500 shadow-inner">
                             #{order._id.slice(-4).toUpperCase()}
                          </div>
                          <div>
                             <p className="text-sm font-black text-gray-900 dark:text-white">{order.orderItems.length} Items</p>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
                          <div className="text-right">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                             <p className="text-2xl font-black text-ino-red">{formatPrice(order.totalPrice)}</p>
                          </div>
                          <span className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-current shadow-sm ${
                            order.status === 'Delivered' ? 'text-green-500 bg-green-500/10' : 
                            order.status === 'Cancelled' ? 'text-red-500 bg-red-500/10' : 'text-ino-yellow bg-ino-yellow/10'
                          }`}>
                             {order.status}
                          </span>
                       </div>
                    </div>
                  ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
