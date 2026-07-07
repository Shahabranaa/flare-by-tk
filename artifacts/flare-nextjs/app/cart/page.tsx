'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { Trash2, ShoppingCart, ArrowRight, Plus, Minus, Loader2 } from 'lucide-react';

interface OrderForm {
  customerName: string; customerPhone: string;
  orderType: 'delivery' | 'pickup'; customerAddress: string; specialInstructions: string;
}

export default function CartPage() {
  const { items, setQty, remove, clear, subtotal } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<OrderForm>({
    customerName: '', customerPhone: '', orderType: 'delivery', customerAddress: '', specialInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = form.orderType === 'delivery' ? 150 : 0;
  const total = subtotal + deliveryFee;

  function set(k: keyof OrderForm, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (items.length === 0) return;
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError('Name and phone are required.'); return;
    }
    if (form.orderType === 'delivery' && !form.customerAddress.trim()) {
      setError('Address is required for delivery.'); return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          customerAddress: form.orderType === 'delivery' ? form.customerAddress.trim() : undefined,
          orderType: form.orderType,
          specialInstructions: form.specialInstructions.trim() || undefined,
          items: items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to place order. Try again.');
        return;
      }
      const order = await res.json();
      clear();
      router.push(`/order/${order.trackingToken}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShoppingCart className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
        <p className="text-zinc-400 mb-8">Add some items from our menu to get started.</p>
        <Link href="/menu" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors">
          Browse Menu <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <form onSubmit={placeOrder} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-5">
            <h2 className="text-xl font-black text-white">Order Details</h2>

            {/* Order type */}
            <div className="grid grid-cols-2 gap-3">
              {(['delivery', 'pickup'] as const).map(t => (
                <label key={t} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  form.orderType === t ? 'border-orange-500/50 bg-orange-500/10 text-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}>
                  <input type="radio" name="orderType" value={t} checked={form.orderType === t} onChange={e => set('orderType', e.target.value)} className="sr-only" />
                  <span className="font-semibold capitalize text-sm">{t}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">Full Name</label>
                <input value={form.customerName} onChange={e => set('customerName', e.target.value)}
                  placeholder="Ali Khan" required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-600" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">Phone Number</label>
                <input value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)}
                  placeholder="0300 1234567" required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-600" />
              </div>
            </div>

            {form.orderType === 'delivery' && (
              <div>
                <label className="text-zinc-400 text-xs font-medium mb-1.5 block">Delivery Address (Bahawalpur only)</label>
                <textarea value={form.customerAddress} onChange={e => set('customerAddress', e.target.value)}
                  placeholder="House #, Street, Block, Area..."
                  rows={3} required={form.orderType === 'delivery'}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-600 resize-none" />
              </div>
            )}

            <div>
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">Special Instructions (optional)</label>
              <textarea value={form.specialInstructions} onChange={e => set('specialInstructions', e.target.value)}
                placeholder="Less spicy, extra mayo..."
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-600 resize-none" />
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-4 rounded-full transition-colors flex items-center justify-center gap-2 text-base">
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Placing Order...</> : <>Place Order <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 lg:sticky lg:top-20">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
              <h2 className="text-xl font-black text-white">Your Order</h2>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">{items.length} items</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-5">
              {items.map(item => (
                <div key={item.menuItemId} className="flex gap-3 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h4>
                      <button onClick={() => remove(item.menuItemId)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-orange-500 font-bold text-sm">Rs. {item.price * item.quantity}</span>
                      <div className="flex items-center gap-1 bg-zinc-800 rounded-lg">
                        <button onClick={() => setQty(item.menuItemId, item.quantity - 1)} className="p-1 hover:bg-zinc-700 rounded-l-lg transition-colors">
                          <Minus className="h-3.5 w-3.5 text-zinc-400" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button onClick={() => setQty(item.menuItemId, item.quantity + 1)} className="p-1 hover:bg-zinc-700 rounded-r-lg transition-colors">
                          <Plus className="h-3.5 w-3.5 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2.5">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span><span>Rs. {subtotal}</span>
              </div>
              {form.orderType === 'delivery' && (
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Delivery Fee</span><span>Rs. 150</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-lg pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span className="text-orange-500">Rs. {total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
