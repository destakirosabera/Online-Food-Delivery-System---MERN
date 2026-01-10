
import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { Food, ConfiguredItem } from '../types';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
}

const MenuPage: React.FC<Props> = ({ onBack }) => {
  const { menuItems, categories } = useMenu();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [size, setSize] = useState('');
  const [modifiers, setModifiers] = useState<{ [key: string]: any }>({});
  const [toppings, setToppings] = useState<string[]>([]);
  const [sauce, setSauce] = useState('');
  const [pref, setPref] = useState<'Rare' | 'Medium' | 'Well-done'>('Medium');
  const [notes, setNotes] = useState('');

  const categoryIcons: {[key: string]: string} = {
    'All': 'ph-squares-four',
    'Burger': 'ph-hamburger',
    'Pizza': 'ph-pizza',
    'Fried Food': 'ph-cooking-pot',
    'Chicken': 'ph-bird',
    'Drinks': 'ph-beer-bottle',
    'Dessert': 'ph-cake'
  };

  const openConfig = (food: Food) => {
    setSelectedFood(food);
    setSize(food.sizeOptions[0].name);
    setSauce(food.availableSauces[0] || '');
    setToppings([]);
    setNotes('');
    const initialMods: any = {};
    food.ingredients.forEach(ing => initialMods[ing] = 'Standard');
    setModifiers(initialMods);
  };

  const calculateCurrentPrice = () => {
    if (!selectedFood) return 0;
    let total = selectedFood.price;
    const sizeOpt = selectedFood.sizeOptions.find(s => s.name === size);
    if (sizeOpt) total += sizeOpt.priceOffset;
    toppings.forEach(t => {
      const top = selectedFood.availableToppings.find(opt => opt.name === t);
      if (top) total += top.priceOffset;
    });
    Object.keys(modifiers).forEach(ing => {
      if (modifiers[ing] === 'Extra') total += 15;
    });
    return total;
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;
    const item: ConfiguredItem = {
      foodId: selectedFood._id,
      name: selectedFood.name,
      price: calculateCurrentPrice(),
      qty: 1,
      imageUrl: selectedFood.imageUrl,
      selectedSize: size,
      selectedSauce: sauce,
      selectedToppings: toppings,
      modifiers: modifiers,
      cookingPreference: selectedFood.hasCookingPreference ? pref : undefined,
      notes: notes
    };
    addToCart(item);
    showToast(`${selectedFood.name} added to cart!`, 'success');
    setSelectedFood(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative page-transition bg-white dark:bg-ino-dark transition-colors duration-300">
      <BackButton onClick={onBack} />
      
      <div className="mb-16 pl-16 md:pl-0 border-b border-gray-100 dark:border-gray-800 pb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Our Menu</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Pick your favorites and customize them to your taste.</p>
        </div>
        <div className="flex bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto max-w-full custom-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex-shrink-0 ${
                activeCategory === cat 
                ? 'bg-white dark:bg-gray-700 text-ino-red dark:text-ino-yellow shadow-sm border border-gray-100 dark:border-gray-600' 
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <i className={`ph-bold ${categoryIcons[cat] || 'ph-squares-four'} text-lg`}></i>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menuItems
          .filter(f => activeCategory === 'All' || f.category === activeCategory)
          .map((food, index) => (
          <div key={food._id} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-6 right-6 bg-white/95 dark:bg-gray-900/95 px-4 py-2 rounded-xl text-xs font-black shadow-lg dark:text-white">
                {formatPrice(food.price)}
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-black text-ino-red mb-2">{food.category}</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{food.name}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 line-clamp-2 leading-relaxed font-medium">{food.description}</p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => openConfig(food)}
                  className="w-full bg-gray-900 dark:bg-gray-700 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-ino-red transition-all shadow-md"
                >
                  Configure & Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedFood} 
        onClose={() => setSelectedFood(null)} 
        title={`Customize ${selectedFood?.name}`}
      >
        <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scroll dark:text-white">
          <div className="mb-10">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-6">Select Size</label>
            <div className="grid grid-cols-2 gap-4">
              {selectedFood?.sizeOptions.map(opt => (
                <button
                  key={opt.name}
                  onClick={() => setSize(opt.name)}
                  className={`p-5 rounded-2xl border-2 font-bold text-xs transition-all flex justify-between items-center ${
                    size === opt.name 
                    ? 'border-ino-red bg-red-50 dark:bg-red-900/20 text-ino-red' 
                    : 'border-gray-50 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <span>{opt.name}</span>
                  {opt.priceOffset > 0 && <span className="opacity-70">+{formatPrice(opt.priceOffset)}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-6">Modify Ingredients</label>
            <div className="space-y-3">
              {selectedFood?.ingredients.map(ing => (
                <div key={ing} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{ing}</span>
                  <div className="flex bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 p-0.5">
                    {['Remove', 'Standard', 'Extra'].map(type => (
                      <button
                        key={type}
                        onClick={() => setModifiers(prev => ({ ...prev, [ing]: type }))}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                          modifiers[ing] === type 
                          ? 'bg-ino-red text-white shadow-sm' 
                          : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {type === 'Standard' ? 'Normal' : type}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-4">Special Requests</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. No ice, extra spicy, etc."
              className="w-full p-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs h-24 resize-none outline-none focus:border-ino-red transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="pt-8 border-t dark:border-gray-700 mt-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</span>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{formatPrice(calculateCurrentPrice())}</p>
          </div>
          <button 
            onClick={handleConfirmAdd} 
            className="bg-ino-red text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all"
          >
            Add to Tray
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;
