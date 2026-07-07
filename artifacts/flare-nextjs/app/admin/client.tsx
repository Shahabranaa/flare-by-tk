'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, LogIn, RefreshCw, Clock } from 'lucide-react';

interface OrderItem { name: string; price: number; quantity: number; }
interface Order {
  id: number; trackingToken: string; customerName: string; customerPhone: string;
  customerAddress: string | null; orderType: string; status: string;
  totalAmount: number; items: OrderItem[]; createdAt: string;
  specialInstructions: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  preparing: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  completed: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUSES = ['new', 'preparing', 'ready', 'completed', 'cancelled'];

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) onSuccess();
    else { setError('Wrong password'); setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="text-center mb-6">
          <LogIn className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-1">Flare by TK</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required autoFocus
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-600"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function OrderDialog({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: (id: number, status: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-black text-white text-lg">Order #{order.id}</h3>
            <p className="text-zinc-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl font-bold">×</button>
        </div>

        <div className="bg-zinc-800 rounded-xl p-4 mb-4 grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-zinc-500 text-xs mb-0.5">Customer</p><p className="text-white font-semibold">{order.customerName}</p><p className="text-zinc-400">{order.customerPhone}</p></div>
          <div><p className="text-zinc-500 text-xs mb-0.5">Type</p><p className="text-white font-semibold capitalize">{order.orderType}</p></div>
          {order.customerAddress && <div className="col-span-2"><p className="text-zinc-500 text-xs mb-0.5">Address</p><p className="text-zinc-300">{order.customerAddress}</p></div>}
          {order.specialInstructions && <div className="col-span-2"><p className="text-zinc-500 text-xs mb-0.5">Instructions</p><p className="text-yellow-400/80 italic text-xs">&quot;{order.specialInstructions}&quot;</p></div>}
        </div>

        <div className="mb-4">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">Items</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-zinc-800 last:border-0">
              <span className="text-zinc-300"><span className="text-zinc-500 mr-1">{item.quantity}x</span>{item.name}</span>
              <span className="text-white font-medium">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-black text-base pt-2 mt-1">
            <span className="text-white">Total</span>
            <span className="text-orange-500">Rs. {order.totalAmount}</span>
          </div>
        </div>

        <div>
          <p className="text-zinc-500 text-xs font-medium mb-2">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => onStatusChange(order.id, s)}
                disabled={order.status === s || order.status === 'completed' || order.status === 'cancelled'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  order.status === s ? STATUS_COLORS[s] : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminClient({ initialAuth }: { initialAuth: boolean }) {
  const [auth, setAuth] = useState(initialAuth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/orders' : `/api/orders?status=${filter}`;
    const res = await fetch(url);
    if (res.ok) { setOrders(await res.json()); setLastRefresh(new Date()); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { if (auth) fetchOrders(); }, [auth, fetchOrders]);

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
      if (selected?.id === id) setSelected(p => p ? { ...p, status } : p);
    }
  }

  if (!auth) return <LoginForm onSuccess={() => setAuth(true)} />;

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {selected && <OrderDialog order={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Orders</h1>
          <p className="text-zinc-500 text-sm">{lastRefresh ? `Last updated ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}</p>
        </div>
        <button onClick={fetchOrders} disabled={loading} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {STATUSES.map(s => (
          <div key={s} className={`rounded-xl border p-3 text-center ${STATUS_COLORS[s]}`}>
            <p className="text-2xl font-black">{counts[s] ?? 0}</p>
            <p className="text-xs capitalize font-medium opacity-80">{s}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
              filter === s ? 'bg-orange-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}>{s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="py-16 flex items-center justify-center"><Loader2 className="h-6 w-6 text-orange-500 animate-spin" /></div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-zinc-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-800">
                <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">#{order.id}</p>
                      <p className="text-zinc-600 text-xs">{order.items.length} items</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{order.customerName}</p>
                      <p className="text-zinc-500 text-xs">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-zinc-300">{order.orderType}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-orange-400">Rs. {order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{new Date(order.createdAt).toLocaleString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        disabled={order.status === 'completed' || order.status === 'cancelled'}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer disabled:cursor-not-allowed bg-transparent ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(order)} className="text-zinc-500 hover:text-white text-xs underline transition-colors">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
