
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Food } from '../types';

interface MenuContextType {
  menuItems: Food[];
  loading: boolean;
  categories: string[];
  addFood: (food: Omit<Food, '_id'>) => void;
  deleteFood: (id: string) => void;
  updateFood: (id: string, food: Partial<Food>) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const PIZZA_SIZES = [{ name: 'Medium', priceOffset: 0 }, { name: 'Large', priceOffset: 250 }];
const BURGER_SIZES = [{ name: 'Single', priceOffset: 0 }, { name: 'Double', priceOffset: 120 }];
const DRINK_SIZES = [{ name: 'Regular', priceOffset: 0 }, { name: 'Jumbo', priceOffset: 35 }];

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<Food[]>([
    // BURGERS (5 items)
    { _id: 'b1', name: 'Signature Beef Stack', category: 'Burger', price: 320, description: 'Double beef stack with melted cheddar and fresh crisp vegetables.', ingredients: ['Beef', 'Cheddar', 'Onion', 'Lettuce', 'Tomato'], spicyLevel: 'None', sizeOptions: BURGER_SIZES, availableToppings: [{ name: 'Bacon', priceOffset: 80 }], availableSauces: ['House', 'Ketchup'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'b2', name: 'Jalapeno Inferno', category: 'Burger', price: 340, description: 'Vivid spicy profile featuring fresh sliced jalapenos.', ingredients: ['Beef', 'Jalapenos', 'Pepper Jack', 'Onion'], spicyLevel: 'Hot', sizeOptions: BURGER_SIZES, availableToppings: [], availableSauces: ['Spicy Mayo'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'b3', name: 'Mushroom Swiss', category: 'Burger', price: 360, description: 'Caramelized mushrooms with melted Swiss cheese.', ingredients: ['Beef', 'Mushroom', 'Swiss Cheese', 'Onion'], spicyLevel: 'None', sizeOptions: BURGER_SIZES, availableToppings: [], availableSauces: ['Garlic Aioli'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'b4', name: 'Classic Single', category: 'Burger', price: 280, description: 'The traditional favorite with house spread.', ingredients: ['Beef', 'Lettuce', 'Tomato', 'Pickles'], spicyLevel: 'None', sizeOptions: BURGER_SIZES, availableToppings: [], availableSauces: ['Ketchup', 'Mustard'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'b5', name: 'Plant-Based Hero', category: 'Burger', price: 400, description: 'Beyond-beef patty with all the trimmings.', ingredients: ['Vegan Patty', 'Vegan Cheese', 'Lettuce', 'Tomato'], spicyLevel: 'None', sizeOptions: BURGER_SIZES, availableToppings: [], availableSauces: ['Vegan Mayo'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=1000' },

    // PIZZA (5 items)
    { _id: 'p1', name: 'Classic Margherita', category: 'Pizza', price: 420, description: 'Vibrant fresh basil leaves over premium melted mozzarella.', ingredients: ['Basil', 'Mozzarella', 'Tomato Sauce'], spicyLevel: 'None', sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: ['Marinara'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'p2', name: 'Pepperoni Feast', category: 'Pizza', price: 550, description: 'Densely packed with colorful, premium zesty pepperoni.', ingredients: ['Pepperoni', 'Mozzarella', 'Oregano'], spicyLevel: 'Mild', sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: ['Marinara'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'p3', name: 'BBQ Chicken Pizza', category: 'Pizza', price: 580, description: 'Grilled chicken with red onions and smokey BBQ base.', ingredients: ['Chicken', 'Red Onion', 'Mozzarella', 'BBQ Base'], spicyLevel: 'Mild', sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: ['BBQ Sauce'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'p4', name: 'Garden Veggie', category: 'Pizza', price: 480, description: 'Bell peppers, mushrooms, and black olives.', ingredients: ['Bell Pepper', 'Mushroom', 'Olives', 'Onion'], spicyLevel: 'None', sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: ['Marinara'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'p5', name: 'Hawaiian Island', category: 'Pizza', price: 520, description: 'The classic ham and pineapple combination.', ingredients: ['Ham', 'Pineapple', 'Mozzarella'], spicyLevel: 'None', sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: ['Marinara'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000' },

    // FRIED FOOD
    { _id: 'f2', name: 'Mozzarella Sticks', category: 'Fried Food', price: 250, description: 'Melty white cheese center with a golden crisp exterior.', ingredients: ['Cheese', 'Breadcrumbs'], spicyLevel: 'None', sizeOptions: [{ name: '6pcs', priceOffset: 0 }], availableToppings: [], availableSauces: ['Marinara'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'f3', name: 'Classic Fries', category: 'Fried Food', price: 120, description: 'Hand-cut sea salt fries.', ingredients: ['Potato', 'Sea Salt'], spicyLevel: 'None', sizeOptions: [{ name: 'Regular', priceOffset: 0 }, { name: 'Large', priceOffset: 60 }], availableToppings: [], availableSauces: ['Ketchup'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=500&q=60' },
    { _id: 'f4', name: 'Potato Wedges', category: 'Fried Food', price: 150, description: 'Seasoned wedges with a crispy edge.', ingredients: ['Potato', 'Paprika'], spicyLevel: 'Mild', sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Sour Cream'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=500&q=60' },
    { _id: 'f5', name: 'Crispy Calamari', category: 'Fried Food', price: 380, description: 'Battered squid rings with lemon.', ingredients: ['Squid', 'Lemon', 'Flour'], spicyLevel: 'None', sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Tartar Sauce'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=1000' },

    // CHICKEN
    { _id: 'c1', name: 'Crispy Tenders', category: 'Chicken', price: 350, description: 'Golden hand-breaded crispy fillets.', ingredients: ['Chicken Breast', 'Breadcrumbs'], spicyLevel: 'None', sizeOptions: [{ name: '5pcs', priceOffset: 0 }, { name: '10pcs', priceOffset: 300 }], availableToppings: [], availableSauces: ['Honey Mustard'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'c2', name: 'BBQ Roast Leg', category: 'Chicken', price: 420, description: 'Slow-roasted with a dark, rich BBQ glaze.', ingredients: ['Chicken Leg', 'BBQ Rub'], spicyLevel: 'Mild', sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['BBQ'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'c3', name: 'Buffalo Wings', category: 'Chicken', price: 380, description: 'Tossed in signature spicy buffalo sauce.', ingredients: ['Chicken Wings', 'Buffalo Sauce'], spicyLevel: 'Hot', sizeOptions: [{ name: '8pcs', priceOffset: 0 }, { name: '16pcs', priceOffset: 350 }], availableToppings: [], availableSauces: ['Blue Cheese'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600' },
    { _id: 'c5', name: 'Grilled Breast', category: 'Chicken', price: 360, description: 'Seasoned with lemon and herbs.', ingredients: ['Chicken Breast', 'Lemon', 'Herbs'], spicyLevel: 'None', sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Yogurt Sauce'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1000' },

    // DRINKS (Only 2 high-quality items)
    { 
      _id: 'd1', 
      name: 'Coca Cola', 
      category: 'Drinks', 
      price: 60, 
      description: 'The original refreshing cola in a classic cold glass.', 
      ingredients: ['Coke'], 
      spicyLevel: 'None', 
      sizeOptions: DRINK_SIZES, 
      availableToppings: [], 
      availableSauces: [], 
      isAvailable: true, 
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=1000' 
    },
    { 
      _id: 'd5', 
      name: 'Fanta Orange', 
      category: 'Drinks', 
      price: 60, 
      description: 'Vibrant and fizzy orange sparkle made with real fruit flavors.', 
      ingredients: ['Fanta'], 
      spicyLevel: 'None', 
      sizeOptions: DRINK_SIZES, 
      availableToppings: [], 
      availableSauces: [], 
      isAvailable: true, 
      imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=1000' 
    },

    // DESSERT (4 items)
    { _id: 'de1', name: 'Chocolate Lava', category: 'Dessert', price: 320, description: 'Deep dark chocolate with warm core.', ingredients: ['Chocolate', 'Butter'], spicyLevel: 'None', sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [{ name: 'Vanilla Scoop', priceOffset: 80 }], availableSauces: ['Chocolate Drizzle'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'de2', name: 'Strawberry Cheesecake', category: 'Dessert', price: 350, description: 'Creamy NY style with fresh glaze.', ingredients: ['Cream Cheese', 'Strawberries'], spicyLevel: 'None', sizeOptions: [{ name: 'Slice', priceOffset: 0 }], availableToppings: [], availableSauces: ['Berry Couli'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'de3', name: 'Warm Brownie', category: 'Dessert', price: 280, description: 'Fudgy walnut brownie.', ingredients: ['Cocoa', 'Walnuts'], spicyLevel: 'None', sizeOptions: [{ name: 'Single', priceOffset: 0 }], availableToppings: [{ name: 'Ice Cream', priceOffset: 100 }], availableSauces: ['Caramel'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=1000' },
    { _id: 'de4', name: 'Berry Sundae', category: 'Dessert', price: 250, description: 'Tri-color ice cream with fresh berries.', ingredients: ['Ice Cream', 'Mixed Berries'], spicyLevel: 'None', sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Chocolate'], isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=1000' }
  ]);

  const categories = ['All', 'Burger', 'Pizza', 'Fried Food', 'Chicken', 'Drinks', 'Dessert'];

  const addFood = (food: Omit<Food, '_id'>) => setMenuItems(prev => [...prev, { ...food, _id: Date.now().toString() } as Food]);
  const deleteFood = (id: string) => setMenuItems(prev => prev.filter(f => f._id !== id));
  const updateFood = (id: string, food: Partial<Food>) => setMenuItems(prev => prev.map(f => f._id === id ? { ...f, ...food } : f));

  return (
    <MenuContext.Provider value={{ menuItems, loading: false, categories, addFood, deleteFood, updateFood }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
};
