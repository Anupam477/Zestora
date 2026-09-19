import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zestora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('zestora_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    localStorage.setItem('zestora_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('zestora_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('zestora_coupon');
    }
  }, [coupon]);

  const addToCart = (dish, quantity = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === dish._id);
      const price = dish.discountPrice || dish.price;
      if (existing) {
        return prevItems.map((i) =>
          i._id === dish._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prevItems,
        {
          _id: dish._id,
          name: dish.name,
          price,
          image: dish.image,
          categoryName: dish.categoryName,
          quantity,
        },
      ];
    });
    success(`Added ${dish.name} to your cart`);
  };

  const removeFromCart = (dishId) => {
    setItems((prev) => prev.filter((i) => i._id !== dishId));
    info('Item removed from cart');
  };

  const updateQuantity = (dishId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === dishId ? { ...i, quantity: newQty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const subtotal = items.reduce((acc, itm) => acc + itm.price * itm.quantity, 0);
      const res = await api.validateCoupon(code, subtotal);
      if (res.success) {
        setCoupon({
          code: res.code,
          discount: res.discount,
        });
        success(res.message);
        return { success: true };
      }
    } catch (err) {
      toastError(err.message || 'Failed to apply coupon');
      return { success: false, error: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    info('Coupon removed');
  };

  // Pricing calculations
  const subtotal = Math.round(items.reduce((acc, itm) => acc + itm.price * itm.quantity, 0) * 100) / 100;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const deliveryFee = subtotal === 0 || subtotal >= 50 ? 0 : 5;
  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const grandTotal = Math.max(0, Math.round((subtotal + tax + deliveryFee - discount) * 100) / 100);
  const totalCount = items.reduce((acc, itm) => acc + itm.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        tax,
        deliveryFee,
        discount,
        grandTotal,
        totalCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
