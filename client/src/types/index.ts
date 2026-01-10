
export interface SizeOption {
  name: string;
  priceOffset: number;
}

export interface Modifier {
  name: string;
  priceOffset: number;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  ingredients: string[];
  calories?: number;
  spicyLevel?: 'None' | 'Mild' | 'Medium' | 'Hot';
  sizeOptions: SizeOption[];
  hasCookingPreference?: boolean;
  availableToppings: Modifier[];
  availableSauces: string[];
}

export interface ConfiguredItem {
  foodId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
  selectedSize: string;
  selectedToppings: string[];
  selectedSauce: string;
  modifiers: { [key: string]: 'Add' | 'Remove' | 'Extra' | 'Standard' };
  cookingPreference?: 'Rare' | 'Medium' | 'Well-done';
  notes?: string;
}

export interface OrderItem {
  food: string;
  name: string;
  qty: number;
  price: number;
  config?: any;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
}
