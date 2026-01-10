
import React from 'react';
import { formatPrice } from '../utils/formatPrice';

interface Props {
  onNavigate: (page: any) => void;
}

const HomePage: React.FC<Props> = ({ onNavigate }) => {
  // 1. Featured Category Highlights (Strictly 3 images in a row)
  const categoryHighlights = [
    { 
      name: 'Signature Burgers', 
      img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800', 
      desc: 'Hand-pressed premium beef'
    },
    { 
      name: 'Artisan Pizzas', 
      img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800', 
      desc: 'Stone-baked perfection'
    },
    { 
      name: 'Cold Refreshments', 
      img: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&q=80&w=800', 
      desc: 'Chilled local favorites'
    }
  ];

  // 2. Featured Food and Drink Cards
  const featuredItems = [
    { 
      name: 'Prime Stack Burger', 
      desc: 'Double beef patties, melted cheddar, and our signature secret dressing.', 
      price: 380, 
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
      type: 'Food'
    },
    { 
      name: 'Tuscany Margherita', 
      desc: 'Fresh basil, vine-ripened tomatoes, and locally sourced mozzarella.', 
      price: 420, 
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      type: 'Food'
    },
    { 
      name: 'Iced Vanilla Latte', 
      desc: 'Smooth espresso marked with creamy milk and rich vanilla bean syrup.', 
      price: 145, 
      img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600',
      type: 'Drink'
    },
    { 
      name: 'Blueberry Mint Fizz', 
      desc: 'Sparkling water infused with fresh berries and garden-picked mint.', 
      price: 110, 
      img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
      type: 'Drink'
    }
  ];

  return (
    <div className="bg-white dark:bg-ino-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* SECTION 1: FULL-SCREEN HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1526367790999-015070c23b50?auto=format&fit=crop&q=90&w=2000" 
            className="w-full h-full object-cover animate-scale-in"
            alt="Logistics Food Delivery Hero"
            loading="eager"
          />
          {/* Dark Overlay for content readability */}
          <div className="absolute inset-0 bg-black/45 dark:bg-black/65 transition-colors duration-500"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl animate-fade-in-up">
          <div className="inline-block px-5 py-2 mb-8 rounded-full bg-ino-red/20 border border-ino-red/30 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ino-red">Logistics Systems v3.1</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white mb-8 leading-tight tracking-tighter uppercase">
            In-N-Out <br/> <span className="text-ino-red drop-shadow-2xl">Logistics</span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Professional urban food logistics meeting premium culinary excellence. 
            Automated ordering, rapid dispatch, and real-time tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button 
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto bg-ino-red text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              Order Now
            </button>
            <button 
              onClick={() => onNavigate('tray')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-ino-dark transition-all"
            >
              View My Tray
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <i className="ph ph-caret-double-down text-white/50 text-2xl"></i>
        </div>
      </section>

      {/* SECTION 2: THREE FEATURED CATEGORIES (Row layout, stacked on mobile) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
          <div className="h-0.5 flex-grow bg-gray-100 dark:bg-gray-800"></div>
          <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em] px-6">Logistics Nodes</h2>
          <div className="h-0.5 flex-grow bg-gray-100 dark:bg-gray-800"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categoryHighlights.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigate('menu')}
              className="group relative h-80 sm:h-[450px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700"
            >
              <img 
                src={cat.img} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75 group-hover:brightness-90"
                alt={cat.name} 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                <span className="text-ino-yellow text-[9px] font-black uppercase tracking-widest block mb-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  Select Hub
                </span>
                <h3 className="text-white font-black text-3xl uppercase tracking-tighter mb-1">{cat.name}</h3>
                <p className="text-gray-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED FOOD & DRINK CARDS */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-ino-red text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Daily Inventory</span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
              Featured Food <br/> & Refreshments
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-8 font-medium leading-relaxed">
              Real-time stock of our top-rated culinary assets, verified for transit stability and optimal quality upon delivery.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('menu')}
            className="bg-ino-dark dark:bg-gray-800 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-ino-red transition-all flex items-center gap-4 shadow-2xl group"
          >
            See our full 29-item menu <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => onNavigate('menu')}
              className="group bg-gray-50 dark:bg-gray-900/40 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-ino-red/30 hover:shadow-3xl transition-all duration-500 flex flex-col cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                />
                <div className="absolute top-8 right-8 bg-white/95 dark:bg-gray-900/95 px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-2xl tracking-widest dark:text-white">
                  {formatPrice(item.price)}
                </div>
                <div className="absolute top-8 left-8">
                   <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${
                     item.type === 'Food' ? 'bg-ino-red text-white' : 'bg-admas-blue text-white'
                   }`}>
                    {item.type}
                   </span>
                </div>
              </div>
              <div className="p-10 flex-grow flex flex-col">
                <h3 className="font-black text-2xl mb-4 text-gray-900 dark:text-white group-hover:text-ino-red transition-colors tracking-tight uppercase">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-10 leading-relaxed flex-grow font-medium">
                  {item.desc}
                </p>
                <div className="w-full py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-3xl text-[10px] font-black uppercase tracking-widest group-hover:bg-ino-red group-hover:text-white group-hover:border-ino-red transition-all shadow-sm text-center">
                  Configure Asset
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UNIVERSITY PROJECT FOOTER BANNER */}
      <section className="bg-ino-dark text-white py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(214,40,40,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="text-center md:text-left max-w-xl">
            <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
              Admas University <br/> 
              <span className="text-ino-red underline decoration-ino-yellow decoration-4 underline-offset-8">Computer Science</span>
            </h4>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Senior Final Year Project - Food Logistics & Dispatch Portal</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 border-l border-white/10 pl-12">
            <div className="text-center md:text-left">
              <p className="text-4xl font-black text-white">2.5k+</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Active Nodes</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-4xl font-black text-ino-yellow">LIVE</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Route Sync</p>
            </div>
            <div className="text-center md:text-left hidden md:block">
              <p className="text-4xl font-black text-ino-red">99.9%</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Uptime Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
