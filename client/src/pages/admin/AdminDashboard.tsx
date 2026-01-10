
import React, { useState, useEffect, useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { Food, Order, User } from '../../types';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

type Tab = 'dashboard' | 'orders' | 'users' | 'menu' | 'settings';

const AdminDashboard: React.FC<{ onBack: () => void, onNavigate?: (page: any) => void }> = ({ onBack, onNavigate }) => {
  const { orders, fetchOrders, updateStatus } = useOrders();
  const { user, allUsers, logout, toggleUserStatus, addAdmin, deleteUser, updateUser, updatePassword } = useAuth();
  const { menuItems, categories, addFood, updateFood, deleteFood } = useMenu();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUserHistory, setSelectedUserHistory] = useState<User | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  // Admin Management State
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });

  // Admin Own Settings State
  const [isEditingSelf, setIsEditingSelf] = useState(false);
  const [selfFormData, setSelfFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passForm, setPassForm] = useState({ new: '', confirm: '' });

  // Menu Management State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);
  const [foodForm, setFoodForm] = useState<Partial<Food>>({
    name: '', description: '', price: 0, category: 'Burger', ingredients: [],
    sizeOptions: [{ name: 'Regular', priceOffset: 0 }], availableToppings: [],
    availableSauces: [], imageUrl: '', isAvailable: true, spicyLevel: 'None'
  });

  useEffect(() => { fetchOrders(); }, []);

  const isStrongPassword = (pass: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return strongRegex.test(pass);
  };

  const stats = useMemo(() => [
    { label: 'Pending Dispatch', count: orders.filter(o => ['Pending', 'Preparing'].includes(o.status)).length, icon: 'ph-clock', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Active Transit', count: orders.filter(o => o.status === 'Out for Delivery').length, icon: 'ph-moped', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Fulfilled', count: orders.filter(o => o.status === 'Delivered').length, icon: 'ph-check-circle', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'User Registry', count: allUsers.length, icon: 'ph-users', color: 'text-ino-yellow', bg: 'bg-ino-yellow/10' },
  ], [orders, allUsers]);

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (allUsers.some(u => u.email.toLowerCase() === adminForm.email.toLowerCase())) {
      showToast("Email already exists", "error");
      return;
    }
    if (!isStrongPassword(adminForm.password)) {
      showToast("Password too weak: Requires 8+ chars, Uppercase, Number, and Special Char.", "error");
      return;
    }
    addAdmin(adminForm.name, adminForm.email, adminForm.password);
    setIsAddingAdmin(false);
    setAdminForm({ name: '', email: '', password: '' });
    showToast("Admin access created successfully", "success");
  };

  const handleUpdateSelfInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser(user.id, selfFormData);
    showToast('Profile updated', 'success');
    setIsEditingSelf(false);
  };

  const handleUpdateSelfPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (passForm.new !== passForm.confirm) {
      showToast('Passwords do not match', "error");
      return;
    }
    if (!isStrongPassword(passForm.new)) {
      showToast("Security Violation: New password must be strong (8+ chars, special char, number).", "error");
      return;
    }
    updatePassword(user.id, passForm.new);
    showToast('Password securely updated', 'success');
    setPassForm({ new: '', confirm: '' });
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodToEdit) {
      updateFood(foodToEdit._id, foodForm);
      showToast("Catalog updated", "success");
    } else {
      addFood(foodForm as Omit<Food, '_id'>);
      showToast("Added to catalog", "success");
    }
    setIsMenuModalOpen(false);
    setFoodToEdit(null);
  };

  const getUserOrders = (userId: string) => orders.filter(o => o.user === userId || (o.user as any)?._id === userId);

  return (
    <div className="min-h-screen bg-ino-dark flex font-sans overflow-hidden">
      <aside className="w-20 md:w-72 border-r border-white/5 flex flex-col h-screen sticky top-0 bg-gray-900/60 backdrop-blur-3xl z-50">
        <div className="p-10 flex items-center justify-center md:justify-start gap-4">
          <div className="w-12 h-12 bg-ino-red rounded-2xl flex items-center justify-center text-white shadow-2xl">
            <i className="ph-fill ph-shield-check text-2xl"></i>
          </div>
          <div className="hidden md:block">
            <h1 className="font-black text-white text-lg tracking-tighter uppercase leading-none">Admin Hub</h1>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Restricted Access</p>
          </div>
        </div>
        <nav className="flex-grow p-6 space-y-3 mt-4">
          {(['dashboard', 'orders', 'users', 'menu', 'settings'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center justify-center md:justify-start gap-5 p-5 rounded-3xl transition-all duration-300 ${activeTab === tab ? 'bg-ino-red text-white shadow-2xl scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <i className={`ph-fill ${tab === 'dashboard' ? 'ph-circles-four' : tab === 'orders' ? 'ph-scroll' : tab === 'users' ? 'ph-users' : tab === 'menu' ? 'ph-cooking-pot' : 'ph-gear'} text-2xl`}></i>
              <span className="hidden md:inline text-[11px] font-black uppercase tracking-[0.2em]">{tab}</span>
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-white/5 space-y-2">
           <button onClick={() => onNavigate?.('home')} className="w-full flex items-center justify-center md:justify-start gap-5 p-4 text-ino-yellow hover:text-white transition-all bg-ino-yellow/5 rounded-2xl border border-ino-yellow/10">
            <i className="ph-bold ph-globe text-2xl"></i>
            <span className="hidden md:inline text-[11px] font-black uppercase tracking-widest">Site View</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center md:justify-start gap-5 p-4 text-gray-500 hover:text-ino-red transition-all">
            <i className="ph-bold ph-power text-2xl"></i>
            <span className="hidden md:inline text-[11px] font-black uppercase tracking-widest">Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-screen bg-ino-dark custom-scroll">
        <div className="max-w-[100%] mx-auto relative">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
            <div>
               <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em]">System Control</h2>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 bg-ino-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-red-700 transition-all active:scale-95"
            >
              <i className="ph-bold ph-power"></i> Log Out
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in space-y-12">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Command Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(s => (
                  <div key={s.label} className="bg-gray-800/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4 ${s.color}`}>
                      <i className={`ph-fill ${s.icon} text-2xl`}></i>
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
             <div className="animate-in fade-in space-y-10">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Order Registry</h2>
               <div className="bg-gray-800/20 rounded-[2.5rem] border border-white/5 overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[1400px]">
                  <thead className="bg-gray-900/50 text-gray-500 text-[9px] font-black uppercase tracking-[0.1em]">
                    <tr>
                      <th className="p-6">Username</th>
                      <th className="p-6">Email</th>
                      <th className="p-6">Location</th>
                      <th className="p-6 text-ino-yellow">Logistics Fee</th>
                      <th className="p-6">Ref ID</th>
                      <th className="p-6">Subtotal</th>
                      <th className="p-6">Gross Total</th>
                      <th className="p-6">Control</th>
                      <th className="p-6 text-right">Insight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[11px] font-bold text-white">
                    {orders.map(o => {
                      const orderUser = typeof o.user === 'object' 
                        ? o.user 
                        : allUsers.find(u => u.id === o.user || (u as any)._id === o.user);

                      const subtotal = o.totalPrice - (o.deliveryFee || 50);

                      return (
                        <tr key={o._id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-6">{orderUser?.name || 'Unknown'}</td>
                          <td className="p-6 text-gray-400">{orderUser?.email || 'N/A'}</td>
                          <td className="p-6 text-gray-400 truncate max-w-xs">{o.deliveryLocation || 'Sector Hub'}</td>
                          <td className="p-6 text-ino-yellow">{formatPrice(o.deliveryFee || 50)}</td>
                          <td className="p-6 font-mono text-gray-500">#{o._id.slice(-6).toUpperCase()}</td>
                          <td className="p-6 text-white/70">{formatPrice(subtotal)}</td>
                          <td className="p-6 text-ino-yellow font-black">{formatPrice(o.totalPrice)}</td>
                          <td className="p-6">
                             <select 
                              value={o.status}
                              onChange={(e) => updateStatus(o._id, e.target.value)}
                              className="bg-gray-700 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg outline-none border border-white/10"
                             >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                             </select>
                          </td>
                          <td className="p-6 text-right">
                             <button onClick={() => setSelectedOrder(o)} className="p-2 bg-white/5 rounded-lg text-white hover:bg-ino-yellow hover:text-ino-dark transition-all"><i className="ph ph-info text-lg"></i></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
               </div>
             </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-in fade-in space-y-10">
               <div className="flex justify-between items-center">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Human Resources</h2>
                 <Button onClick={() => setIsAddingAdmin(true)} className="bg-ino-yellow text-ino-dark px-10 rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-xl">New Admin</Button>
               </div>
               <div className="bg-gray-800/20 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr><th className="p-8">Identification</th><th className="p-8">Privilege</th><th className="p-8">Registry Status</th><th className="p-8 text-right">Operational Tools</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs font-bold text-white">
                    {allUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-8">
                           <p className="font-black text-white">{u.name}</p>
                           <p className="text-[10px] text-gray-500 font-mono mt-0.5">{u.email}</p>
                        </td>
                        <td className="p-8">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.isAdmin ? 'bg-ino-red text-white' : 'bg-gray-700 text-gray-300'}`}>
                             {u.isAdmin ? 'Admin' : 'End User'}
                           </span>
                        </td>
                        <td className="p-8">
                           <button onClick={() => toggleUserStatus(u.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${u.status === 'Active' ? 'text-green-500 bg-green-500/10 hover:bg-green-500/20' : 'text-red-500 bg-red-500/10 hover:bg-red-500/20'}`}>
                             {u.status}
                           </button>
                        </td>
                        <td className="p-8 text-right space-x-2">
                           <button onClick={() => setSelectedUserHistory(u)} className="p-3 bg-white/5 rounded-xl text-white hover:bg-ino-yellow hover:text-ino-dark transition-all" title="View History"><i className="ph ph-clock-counter-clockwise text-lg"></i></button>
                           {u.id !== user?.id && <button onClick={() => deleteUser(u.id)} className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"><i className="ph ph-trash text-lg"></i></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in space-y-12">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Portal Settings</h2>
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  <div className="bg-gray-800/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                         <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity Details</h3>
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Manage core staff identification</p>
                      </div>
                      <button onClick={() => setIsEditingSelf(!isEditingSelf)} className="text-[10px] font-black text-ino-yellow uppercase tracking-widest hover:underline">
                        {isEditingSelf ? 'Cancel' : 'Edit Identity'}
                      </button>
                    </div>
                    <form onSubmit={handleUpdateSelfInfo} className="space-y-6">
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-500 uppercase ml-4">Full Name</label>
                          <input type="text" className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white outline-none focus:ring-1 ring-ino-yellow transition-all disabled:opacity-40" disabled={!isEditingSelf} value={selfFormData.name} onChange={e => setSelfFormData({...selfFormData, name: e.target.value})} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-500 uppercase ml-4">Email Address</label>
                          <input type="email" className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white outline-none focus:ring-1 ring-ino-yellow transition-all disabled:opacity-40" disabled={!isEditingSelf} value={selfFormData.email} onChange={e => setSelfFormData({...selfFormData, email: e.target.value})} />
                       </div>
                       {isEditingSelf && (
                         <Button type="submit" className="w-full py-5 rounded-3xl text-[10px] font-black uppercase bg-ino-yellow text-ino-dark shadow-xl tracking-widest">Commit Changes</Button>
                       )}
                    </form>
                  </div>

                  <div className="bg-gray-800/40 p-10 rounded-[3.5rem] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><i className="ph-fill ph-lock-key text-8xl text-ino-red"></i></div>
                     <div className="mb-10">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Access Control</h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Update access credential strength</p>
                     </div>
                     <form onSubmit={handleUpdateSelfPassword} className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-500 uppercase ml-4">New Secret Key</label>
                          <input type="password" placeholder="••••••••" className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white outline-none focus:ring-1 ring-ino-red" required value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-500 uppercase ml-4">Confirm Key</label>
                          <input type="password" placeholder="••••••••" className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white outline-none focus:ring-1 ring-ino-red" required value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} />
                        </div>
                        <Button type="submit" className="w-full py-5 rounded-3xl text-[10px] font-black uppercase bg-ino-red text-white hover:bg-red-700 transition-all tracking-[0.2em] shadow-xl">Update Access Key</Button>
                     </form>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* RECEIPT ZOOM OVERLAY ("CLEAR VISION") */}
        {zoomedImage && (
          <div 
            className="fixed inset-0 z-[110] bg-black/98 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
            onClick={() => setZoomedImage(null)}
          >
            <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center p-6">
              <img src={zoomedImage} className="max-w-full max-h-[95vh] object-contain rounded-2xl shadow-[0_0_150px_rgba(255,255,255,0.2)] ring-1 ring-white/20" alt="Receipt Zoom" />
              <button className="absolute -top-14 right-6 text-white hover:text-ino-red text-5xl transition-all">
                <i className="ph ph-x-circle"></i>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* USER HISTORY MODAL */}
      <Modal isOpen={!!selectedUserHistory} onClose={() => setSelectedUserHistory(null)} title={`Transmission Log: ${selectedUserHistory?.name}`}>
         <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
            {selectedUserHistory && getUserOrders(selectedUserHistory.id).length > 0 ? (
               getUserOrders(selectedUserHistory.id).map(o => (
                  <div key={o._id} className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 flex justify-between items-center">
                     <div>
                        <p className="text-[10px] font-black text-ino-red uppercase tracking-widest">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-black text-black dark:text-white">{formatPrice(o.totalPrice)}</p>
                        <span className="text-[8px] font-black uppercase text-ino-yellow tracking-widest">{o.status}</span>
                     </div>
                  </div>
               ))
            ) : (
               <div className="py-20 text-center opacity-40">
                  <i className="ph ph-ghost text-5xl mb-4"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">No Log Entries</p>
               </div>
            )}
         </div>
      </Modal>

      {/* ADD ADMIN MODAL */}
      <Modal isOpen={isAddingAdmin} onClose={() => setIsAddingAdmin(false)} title="New System Admin">
         <form onSubmit={handleCreateAdmin} className="space-y-6">
            <input type="text" placeholder="Full Name" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none text-xs font-bold" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} />
            <input type="email" placeholder="Email Address" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none text-xs font-bold" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
            <div className="space-y-2">
              <input type="password" placeholder="Secure Password" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none text-xs font-bold" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} />
              <p className="text-[8px] font-bold text-gray-500 uppercase px-2">Must be 8+ chars with uppercase, number & symbol</p>
            </div>
            <Button type="submit" className="w-full py-5 rounded-3xl text-[10px] uppercase font-black tracking-widest bg-ino-red text-white shadow-xl">Commit Credentials</Button>
         </form>
      </Modal>

      {/* ORDER DETAIL MODAL */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Order Manifest">
         {selectedOrder && (
           <div className="space-y-8 max-h-[75vh] overflow-y-auto pr-2 custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Verification Asset (Big View)</p>
                   {selectedOrder.paymentReceipt ? (
                     <div 
                        className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-zoom-in group relative shadow-inner"
                        onClick={() => setZoomedImage(selectedOrder.paymentReceipt!)}
                     >
                        <img src={selectedOrder.paymentReceipt} className="w-full h-full object-contain" alt="Receipt Proof" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <div className="bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/30">
                              <i className="ph ph-magnifying-glass-plus text-white text-4xl"></i>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <p className="text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase">Missing Receipt</p>
                     </div>
                   )}
                </div>
                <div className="space-y-8">
                   <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Order Identifier</p>
                      <p className="text-2xl font-mono font-black text-black dark:text-white">#{selectedOrder._id.slice(-10).toUpperCase()}</p>
                   </div>
                   <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Payload Content</p>
                      <div className="space-y-4">
                         {selectedOrder.orderItems.map((item, idx) => {
                            const config = (item as any).config || {};
                            return (
                              <div key={idx} className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-[12px] font-black text-gray-800 dark:text-gray-200">{item.qty}x {item.name}</span>
                                    <span className="text-[11px] font-black text-ino-red">{formatPrice(item.price)}</span>
                                 </div>
                                 <div className="space-y-1 opacity-70">
                                    <p className="text-[9px] font-black uppercase text-blue-500">Node: {config.selectedSize || 'Regular'}</p>
                                    {config.notes && <p className="text-[9px] italic text-gray-500 mt-2">Instruction: {config.notes}</p>}
                                 </div>
                              </div>
                            );
                         })}
                      </div>
                   </div>
                   <div className="pt-8 border-t border-gray-100 dark:border-white/10">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Financial Liability</p>
                      <p className="text-4xl font-black text-ino-red">{formatPrice(selectedOrder.totalPrice)}</p>
                   </div>
                </div>
              </div>
           </div>
         )}
      </Modal>

      {/* MENU ASSET MODAL */}
      <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} title={foodToEdit ? "Modify Asset" : "New Catalog Asset"}>
         <form onSubmit={handleMenuSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scroll">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Item Name" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 text-xs font-bold" value={foodForm.name} onChange={e => setFoodForm({...foodForm, name: e.target.value})} />
              <select className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 text-[10px] font-black uppercase" value={foodForm.category} onChange={e => setFoodForm({...foodForm, category: e.target.value})}>
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea placeholder="Description" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 text-xs font-bold h-24" value={foodForm.description} onChange={e => setFoodForm({...foodForm, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
               <input type="number" placeholder="Base Price" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 text-xs font-bold" value={foodForm.price} onChange={e => setFoodForm({...foodForm, price: Number(e.target.value)})} />
               <input type="text" placeholder="Image Resource URL" required className="w-full p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 text-xs font-bold" value={foodForm.imageUrl} onChange={e => setFoodForm({...foodForm, imageUrl: e.target.value})} />
            </div>
            <Button type="submit" className="w-full py-5 rounded-3xl text-[10px] uppercase font-black tracking-widest bg-ino-red text-white">Commit Asset</Button>
         </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
