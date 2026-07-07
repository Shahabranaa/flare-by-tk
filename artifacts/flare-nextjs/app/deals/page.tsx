import type { Metadata } from 'next';
import { sql } from '@/lib/db';
import Image from 'next/image';
import { Flame, Tag } from 'lucide-react';

export const metadata: Metadata = { title: 'Deals — Flare by TK' };
export const revalidate = 60;

interface Deal {
  id: number; title: string; description: string | null; imageUrl: string | null;
  originalPrice: number | null; dealPrice: number | null;
  discountValue: number | null; discountType: string;
}

async function getDeals(): Promise<Deal[]> {
  return sql<Deal>(`
    SELECT id, title, description, image_url AS "imageUrl",
           original_price::float AS "originalPrice",
           deal_price::float AS "dealPrice",
           discount_value::float AS "discountValue",
           discount_type AS "discountType"
    FROM deals WHERE is_active = true
    ORDER BY sort_order, title
  `);
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Limited Time</p>
        <h1 className="text-4xl font-black text-white">Today&apos;s Deals</h1>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <Flame className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
          <p className="text-lg">No active deals right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(deal => (
            <div key={deal.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5 group">
              <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                {deal.imageUrl ? (
                  <Image src={deal.imageUrl} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Flame className="h-16 w-16 text-orange-500/20" />
                  </div>
                )}
                {deal.discountValue && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-sm font-black px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `Rs. ${deal.discountValue} OFF`}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-black text-white text-lg mb-2">{deal.title}</h3>
                {deal.description && <p className="text-zinc-400 text-sm leading-relaxed mb-4">{deal.description}</p>}
                <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                  {deal.dealPrice && (
                    <span className="text-orange-500 font-black text-xl">Rs. {deal.dealPrice}</span>
                  )}
                  {deal.originalPrice && (
                    <span className="text-zinc-600 line-through text-base">Rs. {deal.originalPrice}</span>
                  )}
                  {deal.dealPrice && deal.originalPrice && (
                    <span className="ml-auto text-emerald-400 text-sm font-bold">
                      Save Rs. {Math.round(deal.originalPrice - deal.dealPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
