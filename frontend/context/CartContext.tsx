'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CurrencyCode } from '@/lib/types';
import { api } from '@/lib/api';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalGross: number;
  discountAmount: number;
  totalNet: number;
  couponCode: string;
  couponMessage: string;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

const RATES: Record<CurrencyCode, { rate: number; symbol: string; prefix: boolean }> = {
  USD: { rate: 1.0, symbol: '$', prefix: true },
  EUR: { rate: 0.92, symbol: '€', prefix: false },
  GBP: { rate: 0.79, symbol: '£', prefix: true },
  AED: { rate: 3.67, symbol: 'AED ', prefix: true },
  INR: { rate: 84.50, symbol: '₹', prefix: true },
  SAR: { rate: 3.75, symbol: 'SAR ', prefix: true },
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orbinex_unified_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCurr = localStorage.getItem('orbinex_pref_currency') as CurrencyCode;
      if (savedCurr && RATES[savedCurr]) {
        setCurrency(savedCurr);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('orbinex_unified_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const handleSetCurrency = (curr: CurrencyCode) => {
    setCurrency(curr);
    localStorage.setItem('orbinex_pref_currency', curr);
  };

  const addItem = (itemData: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...itemData,
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setItems((prev) => [...prev, newItem]);
    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (items.length <= 1) {
      removeCoupon();
    }
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
  };

  const totalGross = items.reduce((acc, curr) => acc + curr.amount, 0);
  const totalNet = Math.max(0, totalGross - discountAmount);

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    try {
      const res = await api.validateCoupon(code, totalGross);
      if (res.valid) {
        setCouponCode(res.code || code.toUpperCase());
        setDiscountAmount(res.discount_amount);
        setCouponMessage(res.message);
        return true;
      }
      return false;
    } catch (err: any) {
      setCouponMessage(err.message || 'Invalid coupon code');
      setDiscountAmount(0);
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setCouponMessage('');
  };

  const convertPrice = (amountInUSD: number): number => {
    const info = RATES[currency] || RATES.USD;
    return Math.round(amountInUSD * info.rate * 100) / 100;
  };

  const formatPrice = (amountInUSD: number): string => {
    const info = RATES[currency] || RATES.USD;
    const val = amountInUSD * info.rate;
    const formatted = val.toLocaleString(undefined, {
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return info.prefix ? `${info.symbol}${formatted}` : `${formatted} ${info.symbol}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems: items.length,
        totalGross,
        discountAmount,
        totalNet,
        couponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
        isDrawerOpen,
        setIsDrawerOpen,
        currency,
        setCurrency: handleSetCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
