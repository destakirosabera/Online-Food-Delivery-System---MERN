
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  notifications: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addNotification: (userId: string, message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([
    { id: '2', name: 'Regular Customer', email: 'customer@example.com', isAdmin: false, phone: '+251-911-000-000', notifications: [] }
  ]);

  const login = async (email: string, pass: string) => {
    // Hardcoded Admin Logic
    if (email === 'admin@gmail.com' && pass === 'admin@123') {
      const adminUser = { id: '1', name: 'System Administrator', email, isAdmin: true, notifications: [] };
      setUser(adminUser);
      return true;
    } 
    
    // Simple Customer Auth Simulation
    if (email.includes('@')) {
      const existing = allUsers.find(u => u.email === email);
      if (existing) {
        setUser(existing);
      } else {
        const newUser = { id: Date.now().toString(), name: email.split('@')[0], email, isAdmin: false, phone: '+251-000-000', notifications: [] };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
      }
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addNotification = (userId: string, message: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, notifications: [...u.notifications, message] } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, notifications: [...prev.notifications, message] } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, addNotification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
