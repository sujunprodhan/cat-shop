'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '@/actions/server/cart';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { status } = useSession();

  const updateCartCount = async () => {
    if (status === 'authenticated') {
      try {
        const cartItems = await getCart();
        const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
        setCartCount(totalCount);
      } catch (error) {
        console.error('Failed to update cart count:', error);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [status]);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
