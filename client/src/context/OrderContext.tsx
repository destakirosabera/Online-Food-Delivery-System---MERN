
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  fetchOrders: () => Promise<void>;
  placeOrder: (orderData: any) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { addNotification } = useAuth();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.warn('Logistics Server unreachable. Working in fallback mode.');
    }
  };

  const placeOrder = async (orderData: any) => {
    try {
      const { data } = await api.post('/orders', orderData);
      setOrders(prev => [data, ...prev]);
      setCurrentOrder(data);
    } catch (err) {
      const mockOrder: Order = {
        _id: 'ORD-' + Math.random().toString(36).substr(2, 9),
        user: '2',
        orderItems: orderData.orderItems,
        totalPrice: orderData.totalPrice,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      setOrders(prev => [mockOrder, ...prev]);
      setCurrentOrder(mockOrder);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: status as any } : o));
    } catch (err) {
      setOrders(prev => {
        return prev.map(o => {
          if (o._id === id) {
            // Role-Based Message Trigger
            if (status === 'Preparing') addNotification(o.user, "Approved");
            if (status === 'Cancelled') addNotification(o.user, "Order Cancelled");
            return { ...o, status: status as any };
          }
          return o;
        });
      });
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      currentOrder, 
      fetchOrders, 
      placeOrder, 
      updateStatus,
      setCurrentOrder,
      setOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
