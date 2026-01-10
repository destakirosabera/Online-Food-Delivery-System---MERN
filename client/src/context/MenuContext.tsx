
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

const PIZZA_SIZES = [{ name: 'Small', priceOffset: 0 }, { name: 'Medium', priceOffset: 150 }, { name: 'Large', priceOffset: 300 }];
const BURGER_SIZES = [{ name: 'Single', priceOffset: 0 }, { name: 'Double', priceOffset: 95 }];
const DRINK_SIZES = [{ name: 'Small', priceOffset: 0 }, { name: 'Medium', priceOffset: 20 }, { name: 'Large', priceOffset: 45 }];

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<Food[]>([
    // BURGERS (5)
    { _id: 'b1', name: 'Admas Prime Burger', category: 'Burger', price: 280, calories: 720, description: 'Beef patty with house secret sauce.', ingredients: ['Beef Patty', 'Brioche Bun', 'Tomato', 'Onion', 'Lettuce'], sizeOptions: BURGER_SIZES, hasCookingPreference: true, availableToppings: [{ name: 'Cheese', priceOffset: 30 }, { name: 'Bacon', priceOffset: 50 }], availableSauces: ['House Sauce', 'Ketchup', 'Mayo'], imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
    { _id: 'b2', name: 'Mushroom Swiss', category: 'Burger', price: 320, calories: 810, description: 'Beef patty with sautéed mushrooms and swiss cheese.', ingredients: ['Beef Patty', 'Swiss Cheese', 'Mushrooms', 'Grilled Onions'], sizeOptions: BURGER_SIZES, hasCookingPreference: true, availableToppings: [{ name: 'Extra Cheese', priceOffset: 30 }], availableSauces: ['Garlic Aioli'], imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80' },
    { _id: 'b3', name: 'Zesty BBQ Burger', category: 'Burger', price: 345, calories: 950, description: 'Onion rings and BBQ sauce.', ingredients: ['Beef Patty', 'Bacon', 'Onion Rings', 'BBQ Sauce'], sizeOptions: BURGER_SIZES, hasCookingPreference: true, availableToppings: [{ name: 'Jalapenos', priceOffset: 20 }], availableSauces: ['BBQ', 'Ranch'], imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80' },
    { _id: 'b4', name: 'Firehouse Spicy', category: 'Burger', price: 310, calories: 780, description: 'Spicy peppers and hot sauce.', ingredients: ['Beef Patty', 'Habanero', 'Jalapenos', 'Pepper Jack'], sizeOptions: BURGER_SIZES, hasCookingPreference: true, availableToppings: [{ name: 'Extra Chili', priceOffset: 15 }], availableSauces: ['Spicy Mayo'], spicyLevel: 'Hot', imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=600&q=80' },
    { _id: 'b5', name: 'Garden Veggie', category: 'Burger', price: 270, calories: 450, description: 'Plant-based deliciousness.', ingredients: ['Plant Patty', 'Whole Wheat Bun', 'Avocado', 'Sprouts'], sizeOptions: [{ name: 'Standard', priceOffset: 0 }], hasCookingPreference: false, availableToppings: [{ name: 'Spinach', priceOffset: 10 }], availableSauces: ['Hummus'], imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&q=80' },

    // PIZZA (5)
    { _id: 'p1', name: 'Margherita', category: 'Pizza', price: 420, calories: 1100, description: 'Basil and fresh mozzarella.', ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'], sizeOptions: PIZZA_SIZES, availableToppings: [{ name: 'Extra Basil', priceOffset: 20 }], availableSauces: ['Marinara'], imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=600&q=80' },
    { _id: 'p2', name: 'Pepperoni', category: 'Pizza', price: 540, calories: 1450, description: 'Loaded with spicy pepperoni.', ingredients: ['Dough', 'Pepperoni', 'Mozzarella'], sizeOptions: PIZZA_SIZES, availableToppings: [{ name: 'Extra Meat', priceOffset: 80 }], availableSauces: ['Marinara'], imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80' },
    { _id: 'p3', name: 'BBQ Chicken', category: 'Pizza', price: 580, calories: 1300, description: 'Grilled chicken and red onions.', ingredients: ['Dough', 'Chicken', 'Red Onion', 'BBQ Sauce'], sizeOptions: PIZZA_SIZES, availableToppings: [{ name: 'Bacon bits', priceOffset: 60 }], availableSauces: ['BBQ'], imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
    { _id: 'p4', name: 'Supreme Veggie', category: 'Pizza', price: 490, calories: 1000, description: 'Mixed bell peppers and olives.', ingredients: ['Dough', 'Peppers', 'Olives', 'Mushrooms'], sizeOptions: PIZZA_SIZES, availableToppings: [{ name: 'Vegan Cheese', priceOffset: 100 }], availableSauces: ['Pesto'], imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80' },
    { _id: 'p5', name: 'Meat Lovers', category: 'Pizza', price: 650, calories: 1800, description: 'Sausage, bacon, and ground beef.', ingredients: ['Dough', 'Sausage', 'Bacon', 'Beef'], sizeOptions: PIZZA_SIZES, availableToppings: [{ name: 'Double Meat', priceOffset: 150 }], availableSauces: ['Marinara'], imageUrl: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&q=80' },

    // FRIED FOOD (5)
    { _id: 'f1', name: 'Golden Fries', category: 'Fried Food', price: 140, calories: 365, description: 'Crispy salted potatoes.', ingredients: ['Potatoes', 'Sea Salt'], sizeOptions: PIZZA_SIZES, availableToppings: [{ name: 'Cajun Spice', priceOffset: 10 }], availableSauces: ['Ketchup', 'Cheese Dip'], imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&q=80' },
    { _id: 'f2', name: 'Onion Rings', category: 'Fried Food', price: 180, calories: 410, description: 'Battered jumbo rings.', ingredients: ['Onions', 'Beer Batter'], sizeOptions: PIZZA_SIZES, availableToppings: [], availableSauces: ['Ranch'], imageUrl: 'https://images.unsplash.com/photo-1639024471283-035188835118?w=600&q=80' },
    { _id: 'f3', name: 'Mozzarella Sticks', category: 'Fried Food', price: 250, calories: 550, description: 'Gooey cheese centers.', ingredients: ['Mozzarella', 'Breadcrumbs'], sizeOptions: [{ name: '6pcs', priceOffset: 0 }, { name: '12pcs', priceOffset: 200 }], availableToppings: [], availableSauces: ['Marinara'], imageUrl: 'https://images.unsplash.com/photo-1531749956467-0b19630ad478?w=600&q=80' },
    { _id: 'f4', name: 'Fried Calamari', category: 'Fried Food', price: 380, calories: 480, description: 'Breaded squid rings.', ingredients: ['Squid', 'Lemon', 'Flour'], sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Tartar'], imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80' },
    { _id: 'f5', name: 'Chili Poppers', category: 'Fried Food', price: 210, calories: 420, description: 'Stuffed spicy peppers.', ingredients: ['Jalapenos', 'Cream Cheese'], sizeOptions: [{ name: '5pcs', priceOffset: 0 }, { name: '10pcs', priceOffset: 180 }], availableToppings: [], availableSauces: ['Cool Ranch'], spicyLevel: 'Medium', imageUrl: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=600&q=80' },

    // CHICKEN (5)
    { _id: 'c1', name: 'Crispy Wings', category: 'Chicken', price: 410, calories: 600, description: 'Buffalo or BBQ wings.', ingredients: ['Chicken Wings', 'Brine'], sizeOptions: [{ name: '6pcs', priceOffset: 0 }, { name: '12pcs', priceOffset: 350 }], availableToppings: [], availableSauces: ['Buffalo', 'BBQ'], spicyLevel: 'Medium', imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80' },
    { _id: 'c2', name: 'Tender Strips', category: 'Chicken', price: 340, calories: 520, description: 'Breaded breast strips.', ingredients: ['Chicken Breast', 'Buttermilk'], sizeOptions: [{ name: '3pcs', priceOffset: 0 }, { name: '5pcs', priceOffset: 180 }], availableToppings: [], availableSauces: ['Honey Mustard'], imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80' },
    { _id: 'c3', name: 'Lemon Herb Breast', category: 'Chicken', price: 480, calories: 320, description: 'Grilled healthy chicken.', ingredients: ['Chicken Breast', 'Lemon', 'Thyme'], sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Tzatziki'], imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80' },
    { _id: 'c4', name: 'Roasted Quarter', category: 'Chicken', price: 290, calories: 450, description: 'Slow-roasted leg and thigh.', ingredients: ['Chicken Quarter', 'Paprika'], sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [], availableSauces: ['Gravy'], imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80' },
    { _id: 'c5', name: 'Chicken Nuggets', category: 'Chicken', price: 220, calories: 400, description: 'Bite-sized chicken snacks.', ingredients: ['Ground Chicken', 'Breadcrumbs'], sizeOptions: [{ name: '10pcs', priceOffset: 0 }, { name: '20pcs', priceOffset: 190 }], availableToppings: [], availableSauces: ['Sweet & Sour'], imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c71f9867?w=600&q=80' },

    // DRINKS (5)
    { _id: 'd1', name: 'Coca Cola', category: 'Drinks', price: 50, calories: 140, description: 'Classic soda.', ingredients: ['Carbonated Water', 'Sugar'], sizeOptions: DRINK_SIZES, availableToppings: [{ name: 'Lemon Slice', priceOffset: 5 }], availableSauces: [], imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80' },
    { _id: 'd2', name: 'Pepsi', category: 'Drinks', price: 50, calories: 150, description: 'Refreshing pepsi.', ingredients: ['Carbonated Water', 'Sugar'], sizeOptions: DRINK_SIZES, availableToppings: [{ name: 'Extra Ice', priceOffset: 0 }], availableSauces: [], imageUrl: 'https://images.unsplash.com/photo-1629203851022-39c6f21c25af?w=600&q=80' },
    { _id: 'd3', name: 'Sprite', category: 'Drinks', price: 50, calories: 130, description: 'Lemon-lime soda.', ingredients: ['Carbonated Water', 'Sugar'], sizeOptions: DRINK_SIZES, availableToppings: [], availableSauces: [], imageUrl: 'https://images.unsplash.com/photo-1625772290748-390914a97e98?w=600&q=80' },
    { _id: 'd4', name: '7up', category: 'Drinks', price: 50, calories: 130, description: 'Clear lime refreshment.', ingredients: ['Carbonated Water', 'Sugar'], sizeOptions: DRINK_SIZES, availableToppings: [], availableSauces: [], imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&q=80' },
    { _id: 'd5', name: 'Fanta Orange', category: 'Drinks', price: 50, calories: 160, description: 'Bubbly orange soda.', ingredients: ['Carbonated Water', 'Sugar'], sizeOptions: DRINK_SIZES, availableToppings: [], availableSauces: [], imageUrl: 'https://images.unsplash.com/photo-1634611244301-dd5bd4490906?w=600&q=80' },

    // DESSERT (4)
    { _id: 'de1', name: 'Lava Cake', category: 'Dessert', price: 260, calories: 650, description: 'Molten chocolate center.', ingredients: ['Chocolate', 'Flour', 'Butter'], sizeOptions: [{ name: 'Standard', priceOffset: 0 }], availableToppings: [{ name: 'Vanilla Ice Cream', priceOffset: 80 }], availableSauces: ['Chocolate', 'Raspberry'], imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80' },
    { _id: 'de2', name: 'Cheesecake', category: 'Dessert', price: 310, calories: 580, description: 'Creamy New York style.', ingredients: ['Cream Cheese', 'Graham Crust'], sizeOptions: [{ name: 'Slice', priceOffset: 0 }], availableToppings: [{ name: 'Berries', priceOffset: 50 }], availableSauces: ['Strawberry'], imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80' },
    { _id: 'de3', name: 'Fudge Brownie', category: 'Dessert', price: 180, calories: 420, description: 'Chewy walnut brownie.', ingredients: ['Cocoa', 'Walnuts'], sizeOptions: [{ name: 'Large Piece', priceOffset: 0 }], availableToppings: [], availableSauces: ['Caramel'], imageUrl: 'https://images.unsplash.com/photo-1461009112677-30a4798a1261?w=600&q=80' },
    { _id: 'de4', name: 'Apple Pie', category: 'Dessert', price: 230, calories: 480, description: 'Spiced apple filling.', ingredients: ['Apples', 'Cinnamon', 'Pastry'], sizeOptions: [{ name: 'Slice', priceOffset: 0 }], availableToppings: [{ name: 'Whipped Cream', priceOffset: 40 }], availableSauces: ['Caramel'], imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600&q=80' }
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
