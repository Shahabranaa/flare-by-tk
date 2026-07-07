'use client';
import { useCart, CartItem } from '@/lib/cart';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

type Props = Omit<CartItem, 'quantity'>;

export function AddToCartBtn({ menuItemId, name, price, imageUrl }: Props) {
  const { items, add, setQty, remove } = useCart();
  const item = items.find(i => i.menuItemId === menuItemId);
  const qty = item?.quantity ?? 0;

  if (qty === 0) {
    return (
      <button
        onClick={() => add({ menuItemId, name, price, imageUrl })}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <ShoppingCart className="h-4 w-4" /> Add to Cart
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => qty === 1 ? remove(menuItemId) : setQty(menuItemId, qty - 1)}
        className="px-3 py-2.5 hover:bg-zinc-700 transition-colors text-white font-bold text-lg leading-none"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="font-black text-white text-sm px-2">{qty}</span>
      <button
        onClick={() => setQty(menuItemId, qty + 1)}
        className="px-3 py-2.5 hover:bg-zinc-700 transition-colors text-orange-500 font-bold text-lg leading-none"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
