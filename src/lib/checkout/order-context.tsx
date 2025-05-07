
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderContextType {
  currentOrder: Order | null;
  setCurrentOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Try to restore order from sessionStorage on initial load
  useEffect(() => {
    const savedOrder = sessionStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        setCurrentOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error('Error parsing saved order:', error);
        sessionStorage.removeItem('currentOrder');
      }
    }
  }, []);
  
  // Save order to sessionStorage when it changes
  useEffect(() => {
    if (currentOrder) {
      sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    } else {
      sessionStorage.removeItem('currentOrder');
    }
  }, [currentOrder]);
  
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
    sessionStorage.removeItem('currentOrder');
  };
  
  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder, clearCurrentOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
