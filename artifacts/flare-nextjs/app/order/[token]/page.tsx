'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { CheckCircle, Clock, ChefHat, Package, XCircle, Loader2, ArrowLeft } from 'lucide-react';

interface OrderItem { name: string; price: number; quantity: number; }
interface Order {
  id: number; trackingToken: string; orderType: string; status: string;
  totalAmount: number; items: OrderItem[]; createdAt: string; specialInstructions: string | null;
}

const STATUS_CONFIG = {
  new: { label: 'Order Received', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', step: 1 },
  preparing: { label: 'Being Prepared', icon: ChefHat, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', step: 2 },
  ready: { label: 'Ready for Pickup/Delivery', icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', step: 3 },
  completed: { label: 'Delivered!', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', step: 4 },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', step: 0 },
};

export default function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/track/${token}`);
      if (!res.ok) { setError('Order not found'); return; }
      setOrder(await res.json());
    } catch { setError('Failed to load order'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
      <h2 className="text-xl font-black text-white mb-2">{error || 'Order not found'}</h2>
      <Link href="/menu" className="text-orange-500 hover:underline text-sm">Back to Menu</Link>
    </div>
  );

  const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.new;
  const Icon = cfg.icon;
  const steps = [
    { label: 'Received', step: 1 },
    { label: 'Preparing', step: 2 },
    { label: 'Ready', step: 3 },
    { label: 'Done', step: 4 },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Link href="/menu" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Link>

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border ${cfg.bg} ${cfg.color} mb-4`}>
          <Icon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">{cfg.label}</h1>
        <p className="text-zinc-500 text-sm">Order #{order.id}</p>
      </div>

      {/* Progress bar */}
      {order.status !== 'cancelled' && (
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-black transition-colors ${
                cfg.step >= s.step ? 'border-orange-500 bg-orange-500 text-white' : 'border-zinc-700 text-zinc-600'
              }`}>{s.step}</div>
              <div className="hidden sm:block text-xs text-zinc-600 -mt-6 ml-1">{s.label}</div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${cfg.step > s.step ? 'bg-orange-500' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 ${cfg.bg} ${cfg.color}`}>
        <Icon className="h-4 w-4" />
        {cfg.label}
        {['new', 'preparing', 'ready'].includes(order.status) && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse ml-1" />
        )}
      </div>

      {/* Order details */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 mb-4">
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Order Type</p>
            <p className="text-white font-semibold capitalize">{order.orderType}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs mb-0.5">Total</p>
            <p className="text-orange-500 font-black">Rs. {order.totalAmount}</p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4 space-y-2.5">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Items</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-zinc-300"><span className="text-zinc-500 mr-1">{item.quantity}x</span>{item.name}</span>
              <span className="text-white font-medium">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-zinc-500 text-xs mb-1">Special Instructions</p>
            <p className="text-yellow-400/80 text-sm italic">&quot;{order.specialInstructions}&quot;</p>
          </div>
        )}
      </div>

      <p className="text-center text-zinc-600 text-xs">
        This page refreshes automatically every 8 seconds.
      </p>
    </div>
  );
}
