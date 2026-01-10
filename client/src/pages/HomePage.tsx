
import React from 'react';
import { formatPrice } from '../utils/formatPrice';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigate: (page: any) => void;
}

const HomePage: React.FC<Props> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  const categoryHighlights = [
    { 
      name: 'Burger', 
      img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800', 
      desc: 'Premium beef stacks'
    },
    { 
      name: 'Pizza', 
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 
      desc: 'Artisan stone-baked'
    },
    { 
      name: 'Drinks & Chicken', 
      img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800', 
      desc: 'Crispy & Refreshing'
    }
  ];

  const foodItems = [
    { name: 'Double-Double', desc: 'Two beef patties, toasted bun.', price: 280, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600' },
    { name: 'Margherita', desc: 'Fresh basil and mozzarella.', price: 420, img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600' },
    { name: 'Spicy Wings', desc: 'Crispy with buffalo sauce.', price: 410, img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600' },
    { name: 'Iced Berry Soda', desc: 'Fresh berries with sparkling soda.', price: 120, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600' }
  ];

  const handleMenuAccess = () => {
    if (isAuthenticated) {
      onNavigate('menu');
    } else {
      onNavigate('auth');
    }
  };

  return (
    <div className="bg-white dark:bg-ino-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* HERO SECTION - FULL WIDTH & HEIGHT */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=90&w=2000" 
            className="w-full h-full object-cover"
            alt="Food Delivery Hero"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
            Welcome to <span className="text-ino-red">In-N-Out</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto font-bold uppercase tracking-widest">
            Food Delivery
          </p>
          <button 
            onClick={handleMenuAccess}
            className="bg-ino-red text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl transform hover:scale-105"
          >
            out menu
          </button>
        </div>
      </section>

      {/* FEATURED CATEGORIES - ROW ON DESKTOP, STACKED ON MOBILE */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row gap-8">
          {categoryHighlights.map((cat, idx) => (
            <div 
              key={idx} 
              className="flex-1 group relative h-72 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
              onClick={handleMenuAccess}
            >
              <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{cat.name}</h3>
                <p className="text-ino-yellow text-[10px] font-black uppercase tracking-widest">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOD & DRINK SECTION - DISPLAY CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gray-50 dark:bg-gray-900/40 rounded-[4rem] mb-20 border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Gourmet Selection</h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Prepared Fresh to Order</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {foodItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col group hover:shadow-2xl transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</h3>
                  <span className="text-ino-red font-black text-lg">{formatPrice(item.price)}</span>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-tight mb-8 h-8 line-clamp-2">{item.desc}</p>
                <button onClick={handleMenuAccess} className="w-full py-4 bg-ino-dark dark:bg-gray-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ino-red transition-all shadow-xl">
                  Configure Selection
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <button 
            onClick={handleMenuAccess}
            className="inline-flex items-center gap-6 bg-ino-yellow text-ino-dark px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-yellow-400 transition-all transform hover:-translate-y-1"
          >
            All our menu <i className="ph-bold ph-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
