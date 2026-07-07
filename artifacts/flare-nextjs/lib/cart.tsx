'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>) => void;
  setQty: (menuItemId: number, qty: number) => void;
  remove: (menuItemId: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem('flare-cart');
      if (s) setItems(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('flare-cart', JSON.stringify(items));
  }, [items, ready]);

  function add(item: Omit<CartItem, 'quantity'>) {
    setItems(p => {
      const ex = p.find(i => i.menuItemId === item.menuItemId);
      if (ex) return p.map(i => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...p, { ...item, quantity: 1 }];
    });
  }

  function setQty(menuItemId: number, qty: number) {
    if (qty <= 0) setItems(p => p.filter(i => i.menuItemId !== menuItemId));
    else setItems(p => p.map(i => i.menuItemId === menuItemId ? { ...i, quantity: qty } : i));
  }

  function remove(menuItemId: number) {
    setItems(p => p.filter(i => i.menuItemId !== menuItemId));
  }

  function clear() { setItems([]); }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}
