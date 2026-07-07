import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { AddToCartBtn } from '@/components/add-to-cart-btn';
import { ArrowRight, Flame, Clock, MapPin } from 'lucide-react';

interface MenuItem {
  id: number; name: string; price: number; originalPrice: number | null;
  imageUrl: string | null; description: string | null; categoryName: string | null;
  isAvailable: boolean;
}
interface Deal {
  id: number; title: string; description: string | null; imageUrl: string | null;
  originalPrice: number | null; dealPrice: number | null; discountValue: number | null; discountType: string;
}

async function getFeatured(): Promise<MenuItem[]> {
  return sql<MenuItem>(`
    SELECT mi.id, mi.name, mi.price::float AS price,
           mi.original_price::float AS "originalPrice",
           mi.image_url AS "imageUrl", mi.description,
           c.name AS "categoryName", mi.is_available AS "isAvailable"
    FROM menu_items mi
    LEFT JOIN categories c ON mi.category_id = c.id
    WHERE mi.is_featured = true AND mi.is_available = true
    ORDER BY mi.name LIMIT 8
  `);
}

async function getDeals(): Promise<Deal[]> {
  return sql<Deal>(`
    SELECT id, title, description, image_url AS "imageUrl",
           original_price::float AS "originalPrice",
           deal_price::float AS "dealPrice",
           discount_value::float AS "discountValue",
           discount_type AS "discountType"
    FROM deals WHERE is_active = true
    ORDER BY sort_order, title LIMIT 4
  `);
}

export default async function Home() {
  const [featured, deals] = await Promise.all([getFeatured(), getDeals()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.12)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Flame className="h-4 w-4" /> Now Open in Bahawalpur
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-none mb-6">
            FLARE<br /><span className="text-orange-500">BY TK.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 mb-8 max-w-xl mx-auto">
            Fire-grilled burgers, biryani, broast & more. Authentic flavours, delivered hot.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-colors flex items-center justify-center gap-2 text-base"
            >
              Order Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/deals"
              className="border border-zinc-700 hover:border-orange-500/50 text-white font-bold px-8 py-4 rounded-full transition-colors text-base"
            >
              View Deals
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange-500" /> Near Dubai Chowk, Bahawalpur</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-500" /> 12PM – 1AM Daily</span>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featured.length > 0 && (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-1">Fan Favourites</p>
              <h2 className="text-3xl font-black text-white">Must Try Items</h2>
            </div>
            <Link href="/menu" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
              Full Menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(item => (
              <div key={item.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors group">
                <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-zinc-500 mb-0.5">{item.categoryName}</p>
                  <h3 className="font-bold text-white text-sm leading-tight mb-2 line-clamp-1">{item.name}</h3>
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
        </section>
      )}

      {/* Deals */}
      {deals.length > 0 && (
        <section className="py-16 px-4 bg-zinc-950/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-1">Save More</p>
                <h2 className="text-3xl font-black text-white">Today&apos;s Deals</h2>
              </div>
              <Link href="/deals" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                All Deals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {deals.map(deal => (
                <div key={deal.id} className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden hover:border-orange-500/30 transition-colors">
                  <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                    {deal.imageUrl ? (
                      <Image src={deal.imageUrl} alt={deal.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Flame className="h-12 w-12 text-orange-500/30" />
                      </div>
                    )}
                    {deal.discountValue && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {deal.discountType === 'percentage' ? `-${deal.discountValue}%` : `-Rs.${deal.discountValue}`}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1 line-clamp-1">{deal.title}</h3>
                    {deal.description && <p className="text-zinc-400 text-xs line-clamp-2 mb-3">{deal.description}</p>}
                    <div className="flex items-center gap-2">
                      {deal.dealPrice && <span className="text-orange-500 font-black">Rs. {deal.dealPrice}</span>}
                      {deal.originalPrice && <span className="text-zinc-600 text-sm line-through">Rs. {deal.originalPrice}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to Order?</h2>
          <p className="text-zinc-400 mb-6">Delivery across Bahawalpur · Rs. 150 flat delivery fee</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-colors text-base"
          >
            Browse Full Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
