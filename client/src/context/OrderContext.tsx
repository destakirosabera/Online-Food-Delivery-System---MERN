
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const { user, addNotification } = useAuth();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.warn('Logistics Backend Unreachable. Data persisted in local context.');
    }
  };

  const placeOrder = async (orderData: any) => {
    // Capture the current user ID for proper association
    const userId = user?.id || 'guest-node';

    try {
      const { data } = await api.post('/orders', { ...orderData, user: userId });
      setOrders(prev => [data, ...prev]);
      setCurrentOrder(data);
    } catch (err) {
      // Robust Mock Order for offline/demo mode
      const mockOrder: Order = {
        _id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        user: userId, // Correctly associate with the logged-in user
        orderItems: orderData.orderItems,
        totalPrice: orderData.totalPrice,
        deliveryLocation: orderData.deliveryLocation,
        deliveryFee: orderData.deliveryFee,
        status: 'Pending',
        paymentMethod: orderData.paymentMethod,
        paymentReceipt: orderData.paymentReceipt,
        createdAt: new Date().toISOString()
      };
      setOrders(prev => [mockOrder, ...prev]);
      setCurrentOrder(mockOrder);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      processStatusChange(id, status);
    } catch (err) {
      processStatusChange(id, status);
    }
  };

  const processStatusChange = (id: string, status: string) => {
    setOrders(prev => prev.map(o => {
      if (o._id === id) {
        const userId = typeof o.user === 'string' ? o.user : (o.user as any).id || (o.user as any)._id;
        
        if (status === 'Preparing') addNotification(userId, `Order #${o._id.slice(-6).toUpperCase()} is now being prepared.`);
        if (status === 'Out for Delivery') addNotification(userId, `Order #${o._id.slice(-6).toUpperCase()} is dispatched and in transit.`);
        if (status === 'Delivered') addNotification(userId, `Order #${o._id.slice(-6).toUpperCase()} has been fulfilled.`);
        if (status === 'Cancelled') addNotification(userId, `Order #${o._id.slice(-6).toUpperCase()} was cancelled by admin.`);
        
        return { ...o, status: status as any };
      }
      return o;
    }));
    if (currentOrder?._id === id) {
      setCurrentOrder(prev => prev ? { ...prev, status: status as any } : null);
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
