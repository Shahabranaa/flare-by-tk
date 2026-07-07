'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AddToCartBtn } from '@/components/add-to-cart-btn';
import { Search, Loader2 } from 'lucide-react';

interface Category { id: number; name: string; slug: string; }
interface MenuItem {
  id: number; name: string; price: number; originalPrice: number | null;
  imageUrl: string | null; description: string | null;
  categoryId: number; categoryName: string | null;
  isAvailable: boolean; isFeatured: boolean;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/menu-items?available=true').then(r => r.json()),
    ]).then(([cats, itms]) => {
      setCategories(cats);
      setItems(itms);
      setLoading(false);
    });
  }, []);

  const filtered = items.filter(i => {
    const matchCat = activeCategory === null || i.categoryId === activeCategory;
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = categories
    .filter(c => activeCategory === null || c.id === activeCategory)
    .map(c => ({ ...c, items: filtered.filter(i => i.categoryId === c.id) }))
    .filter(c => c.items.length > 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-1">Full Menu</p>
        <h1 className="text-4xl font-black text-white mb-6">What We Serve</h1>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-orange-500/50"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === null ? 'bg-orange-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id === activeCategory ? null : c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === c.id ? 'bg-orange-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No items found.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(cat => (
            <div key={cat.id}>
              <h2 className="text-2xl font-black text-white mb-5 flex items-center gap-3">
                {cat.name}
                <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">{cat.items.length}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cat.items.map(item => (
                  <div key={item.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors group">
                    <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                      )}
                      {item.isFeatured && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">🔥 Popular</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-zinc-500 text-xs line-clamp-2 mb-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-orange-500 font-black text-base">Rs. {item.price}</span>
                        {item.originalPrice && (
                          <span className="text-zinc-600 text-xs line-through">Rs. {item.originalPrice}</span>
                        )}
                      </div>
                      <AddToCartBtn menuItemId={item.id} name={item.name} price={item.price} imageUrl={item.imageUrl} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
