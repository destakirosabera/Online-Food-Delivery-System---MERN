
import React, { useState, useEffect, useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { Order, Food, OrderItem } from '../../types';
import Modal from '../../components/common/Modal';
import ProfilePage from '../ProfilePage';
import '../../styles/admin.css';

const AdminDashboard: React.FC<{ onBack: () => void; onNavigate: (page: any) => void }> = ({ onBack, onNavigate }) => {
  const { orders, fetchOrders, updateStatus } = useOrders();
  const { allUsers, logout, toggleUserStatus, deleteUser, addAdmin } = useAuth();
  const { menuItems, addFood, updateFood, deleteFood } = useMenu();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  const [menuFormData, setMenuFormData] = useState({ 
    name: '', 
    price: 0, 
    description: '', 
    category: 'Burger', 
    imageUrl: '', 
    ingredients: '' 
  });
  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '' });
  const [editingItem, setEditingItem] = useState<Food | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    showToast("Session Terminated.", "success");
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArray = menuFormData.ingredients.split(',').map(i => i.trim()).filter(i => i !== '');
    
    let defaultSizes = [{ name: 'Regular', priceOffset: 0 }];
    if (menuFormData.category === 'Drinks') {
      defaultSizes = [{ name: 'Small', priceOffset: 0 }, { name: 'Medium', priceOffset: 15 }, { name: 'Large', priceOffset: 30 }];
    } else if (menuFormData.category === 'Pizza') {
      defaultSizes = [{ name: 'Medium', priceOffset: 0 }, { name: 'Large', priceOffset: 250 }];
    } else if (menuFormData.category === 'Burger') {
      defaultSizes = [{ name: 'Single', priceOffset: 0 }, { name: 'Double', priceOffset: 120 }];
    }

    const payload = {
      ...menuFormData,
      ingredients: ingredientsArray,
      sizeOptions: defaultSizes,
      spicyLevel: 'None' as const,
      availableToppings: [],
      availableSauces: [],
      isAvailable: true
    };

    if (editingItem) {
      updateFood(editingItem._id, payload);
      showToast("Catalog Asset Updated", "success");
    } else {
      addFood(payload as any);
      showToast("Added to Dispatch Catalog", "success");
    }
    setIsMenuModalOpen(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminFormData.password.length < 8) {
      showToast("Security Violation: Password too short.", "error");
      return;
    }
    addAdmin(adminFormData.name, adminFormData.email, adminFormData.password);
    showToast("New Staff Account Authorized.", "success");
    setIsAdminModalOpen(false);
    setAdminFormData({ name: '', email: '', password: '' });
  };

  const stats = useMemo(() => ({
    total: orders.length,
    today: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length,
    users: allUsers.length,
    items: menuItems.length
  }), [orders, allUsers, menuItems]);

  const renderModifiers = (item: OrderItem) => {
    if (!item.config || !item.config.modifiers) return null;
    const mods = item.config.modifiers as Record<string, any>;
    return Object.entries(mods).map(([key, val]) => {
      if (val === 'Standard' || val === 'Normal') return null;
      return (
        <span key={key} className={`inline-block mr-1 text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${val === 'Remove' || val === 'No' || val === 'RemoveNo' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          {val}: {key}
        </span>
      );
    }).filter(Boolean);
  };

  const menuTabs = [
    { id: 'dashboard', label: 'Dash' },
    { id: 'orders', label: 'Orders' },
    { id: 'menu', label: 'Catalog' },
    { id: 'users', label: 'HR' },
    { id: 'settings', label: 'Main' }
  ];

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 dark:bg-ino-dark min-h-screen relative">
      {/* MOBILE-FIRST TOP NAV / DESKTOP SIDEBAR */}
      <aside className="w-full md:w-[260px] bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 sticky top-16 md:top-0 z-40 transition-all shadow-sm md:shadow-none">
        <div className="hidden md:block p-8 border-b border-gray-100 dark:border-gray-800">
          <h1 className="font-black text-xl text-ino-red uppercase tracking-tighter">Admin Hub</h1>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">System Control</p>
        </div>
        
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible p-2 md:p-4 space-x-1.5 md:space-x-0 md:space-y-2 custom-scroll scrollbar-hide">
          {menuTabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`whitespace-nowrap flex-shrink-0 px-4 md:px-5 py-2.5 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-ino-red text-white shadow-md' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {tab.label}
            </button>
          ))}
          <button onClick={handleLogout} className="md:hidden whitespace-nowrap px-4 py-2.5 rounded-lg text-[9px] font-black uppercase text-red-500 border border-red-500/10">
            Exit
          </button>
        </nav>

        <div className="hidden md:block p-8 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full py-4 text-[9px] font-black uppercase text-gray-400 hover:text-ino-red transition-colors flex items-center justify-center gap-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
             Terminate Session
          </button>
        </div>
      </aside>

      {/* COMPACT MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-12">
        {activeTab === 'dashboard' && (
          <div className="portal-animate">
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 md:mb-10 tracking-tighter">System Control</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: 'Total Orders', value: stats.total, color: 'text-gray-900 dark:text-white' },
                { label: 'Live Today', value: stats.today, color: 'text-ino-yellow' },
                { label: 'Registry', value: stats.users, color: 'text-gray-900 dark:text-white' },
                { label: 'Asset Count', value: stats.items, color: 'text-gray-900 dark:text-white' }
              ].map((s, i) => (
                <div key={i} className="p-5 md:p-8 bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                  <p className="text-[7px] md:text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 md:mb-3">{s.label}</p>
                  <p className={`text-2xl md:text-4xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="portal-animate">
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 md:mb-10 tracking-tighter">Order Log</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-[8px] md:text-[9px] font-black uppercase text-gray-400">
                      <th className="p-4 md:p-6">ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Sum</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {orders.map(o => (
                      <tr key={o._id} className="text-[10px] md:text-xs">
                        <td className="p-4 md:p-6 font-mono font-black text-ino-red">#{o._id.slice(-4).toUpperCase()}</td>
                        <td className="p-4 font-bold max-w-[100px] truncate">{(o as any).customerName || 'User'}</td>
                        <td className="p-4 font-black text-ino-red">{formatPrice((o.totalPrice || 0) + (o.deliveryFee || 50))}</td>
                        <td className="p-4">
                          <select 
                            value={o.status} 
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            className="bg-gray-50 dark:bg-gray-900 p-1.5 md:p-2 rounded-lg border dark:border-gray-700 text-[8px] font-black uppercase outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button onClick={() => setViewingOrder(o)} className="text-[8px] font-black uppercase text-ino-yellow hover:underline">Manifest</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="portal-animate">
             <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">Catalog</h2>
              <button 
                onClick={() => { setEditingItem(null); setMenuFormData({ name: '', price: 0, description: '', category: 'Burger', imageUrl: '', ingredients: '' }); setIsMenuModalOpen(true); }}
                className="bg-ino-red text-white px-4 md:px-6 py-2.5 md:py-3.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95"
              >
                Add Asset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {menuItems.map(item => (
                <div key={item._id} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-3 md:mb-4 bg-gray-100 dark:bg-gray-900">
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black uppercase text-[10px] md:text-xs mb-1 truncate">{item.name}</h3>
                    <p className="text-ino-red font-black text-[9px] md:text-xs mb-3 md:mb-4">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { 
                      setEditingItem(item); 
                      setMenuFormData({ name: item.name, price: item.price, description: item.description, category: item.category, imageUrl: item.imageUrl, ingredients: item.ingredients.join(', ') }); 
                      setIsMenuModalOpen(true); 
                    }} className="flex-1 py-2 md:py-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-[8px] font-black uppercase">Edit</button>
                    <button onClick={() => deleteFood(item._id)} className="flex-1 py-2 md:py-3 bg-red-50 text-red-500 rounded-lg text-[8px] font-black uppercase">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="portal-animate">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">HR Registry</h2>
              <button onClick={() => setIsAdminModalOpen(true)} className="bg-ino-red text-white px-4 md:px-6 py-2.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest">Add Admin</button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-[8px] font-black uppercase text-gray-400">
                      <th className="p-4 md:p-6">Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th className="text-right p-4 md:p-6">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {allUsers.map(u => (
                      <tr key={u.id} className="text-[10px] md:text-xs">
                        <td className="p-4 md:p-6 font-bold truncate max-w-[120px]">{u.name}</td>
                        <td className="text-gray-400 truncate max-w-[120px]">{u.email}</td>
                        <td><span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase ${u.isAdmin ? 'bg-ino-red/10 text-ino-red' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                        <td className="p-4 md:p-6 text-right">
                          <div className="flex justify-end gap-2 md:gap-3">
                            <button onClick={() => toggleUserStatus(u.id)} className="text-[8px] font-black uppercase text-ino-yellow">{u.status === 'Active' ? 'Freeze' : 'Live'}</button>
                            {!u.isAdmin && <button onClick={() => deleteUser(u.id)} className="text-[8px] font-black uppercase text-red-500">Purge</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="portal-animate">
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-6 md:mb-10 tracking-tighter">Main Control</h2>
            <ProfilePage onBack={() => setActiveTab('dashboard')} onNavigate={onNavigate} />
          </div>
        )}
      </main>

      {/* COMPACT MODALS */}
      <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} title={editingItem ? 'Edit Asset' : 'New Asset'}>
        <form onSubmit={handleMenuSubmit} className="space-y-3">
          <input type="text" placeholder="Asset Name" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs font-bold" value={menuFormData.name} onChange={e => setMenuFormData({...menuFormData, name: e.target.value})} required />
          <input type="text" placeholder="Image URL" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs font-bold" value={menuFormData.imageUrl} onChange={e => setMenuFormData({...menuFormData, imageUrl: e.target.value})} required />
          <div className="flex gap-3">
             <input type="number" placeholder="Price (ETB)" className="w-1/2 p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs font-bold" value={menuFormData.price} onChange={e => setMenuFormData({...menuFormData, price: Number(e.target.value)})} required />
             <select className="w-1/2 p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-[10px] font-black uppercase" value={menuFormData.category} onChange={e => setMenuFormData({...menuFormData, category: e.target.value})}>
                <option value="Burger">Burger</option>
                <option value="Pizza">Pizza</option>
                <option value="Drinks">Drinks</option>
                <option value="Chicken">Chicken</option>
             </select>
          </div>
          <input type="text" placeholder="Modifier Keys (Salt, Spice...)" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs font-bold" value={menuFormData.ingredients} onChange={e => setMenuFormData({...menuFormData, ingredients: e.target.value})} required />
          <textarea placeholder="Description" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs font-bold h-20 resize-none" value={menuFormData.description} onChange={e => setMenuFormData({...menuFormData, description: e.target.value})} required />
          <button type="submit" className="w-full py-4 bg-ino-red text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg">Commit Changes</button>
        </form>
      </Modal>

      <Modal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} title="New Staff Profile">
        <form onSubmit={handleAdminSubmit} className="space-y-3">
          <input type="text" placeholder="Full Name" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs" value={adminFormData.name} onChange={e => setAdminFormData({...adminFormData, name: e.target.value})} required />
          <input type="email" placeholder="Email Registry" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs" value={adminFormData.email} onChange={e => setAdminFormData({...adminFormData, email: e.target.value})} required />
          <input type="password" placeholder="Secure Key" className="w-full p-3 md:p-4 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-xs" value={adminFormData.password} onChange={e => setAdminFormData({...adminFormData, password: e.target.value})} required />
          <button type="submit" className="w-full py-3.5 bg-ino-red text-white rounded-lg font-black uppercase text-[9px] tracking-widest">Authorize Staff</button>
        </form>
      </Modal>

      <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title="Order Manifest">
        {viewingOrder && (
          <div className="space-y-4 md:space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-[7px] font-black text-gray-400 uppercase mb-1 tracking-widest">Identity</p>
              <p className="font-bold text-xs">{(viewingOrder as any).customerName}</p>
              <p className="text-[9px] text-gray-500 font-bold">{(viewingOrder as any).customerEmail}</p>
              <p className="text-[9px] text-gray-500 font-bold">{(viewingOrder as any).customerPhone}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-[7px] font-black text-gray-400 uppercase mb-1 tracking-widest">Coordinates</p>
              <p className="text-[10px] font-bold leading-relaxed">{(viewingOrder as any).destination}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[7px] font-black text-ino-red uppercase tracking-widest">Payload Data</p>
              {viewingOrder.orderItems.map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-50 dark:border-gray-700">
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="font-black truncate max-w-[150px]">{item.qty}x {item.name}</span>
                    <span className="font-black text-ino-red">{formatPrice(item.price * item.qty)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {renderModifiers(item)}
                    {item.config?.notes && (
                      <span className="inline-block bg-gray-50 dark:bg-gray-800 text-[6px] font-bold px-1 py-0.5 rounded text-gray-400 italic">Info: {item.config.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
              <p className="text-[8px] font-black uppercase text-gray-500">Gross Total</p>
              <p className="text-xl md:text-2xl font-black text-ino-red">{formatPrice((viewingOrder.totalPrice || 0) + (viewingOrder.deliveryFee || 50))}</p>
            </div>
            {viewingOrder.paymentReceipt && (
              <button onClick={() => setZoomedImage(viewingOrder.paymentReceipt!)} className="w-full py-3 bg-gray-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">Verify Audit Receipt</button>
            )}
          </div>
        )}
      </Modal>

      {/* FULL VISION RECEIPT OVERLAY */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[110] bg-black/98 flex items-center justify-center p-2" onClick={() => setZoomedImage(null)}>
          <div className="relative max-w-full max-h-full">
            <img src={zoomedImage} className="max-w-full max-h-[90vh] object-contain rounded-xl" alt="Audit Vision" />
            <button className="absolute top-2 right-2 p-2 text-white text-3xl"><i className="ph ph-x-circle"></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
