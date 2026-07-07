'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Flame, Tag, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/cart';

interface Category { id: number; name: string; description: string | null; isActive: boolean; }
interface MenuItem {
  id: number; name: string; price: number; originalPrice: number | null;
  imageUrl: string | null; description: string | null;
  categoryId: number; isAvailable: boolean; isFeatured: boolean;
}
interface Deal {
  id: number; title: string; description: string | null; imageUrl: string | null;
  originalPrice: number | null; dealPrice: number | null;
}

const SEC_TOP = 'most-selling';
const SEC_DEALS = 'deals';

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-xl font-heading font-black tracking-tight text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-xs mt-1 ml-8" style={{ color: 'var(--muted-fg)' }}>{subtitle}</p>}
    </div>
  );
}

function ItemCard({ item }: { item: MenuItem }) {
  const { items, add, setQty } = useCart();
  const cartItem = items.find(i => i.menuItemId === item.id);
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="group flex rounded-2xl overflow-hidden border transition-all duration-200 h-[110px]"
         style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start gap-1.5 mb-1">
            {item.isFeatured && (
              <span className="mt-px shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide"
                    style={{ backgroundColor: 'rgba(255,107,26,0.12)', color: 'var(--primary)' }}>
                Hot
              </span>
            )}
            <h3 className="font-heading font-bold text-[13px] leading-snug text-white line-clamp-2">{item.name}</h3>
          </div>
          {item.description && (
            <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: 'var(--muted-fg)' }}>
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-sm" style={{ color: 'var(--primary)' }}>Rs. {item.price}</span>
            {item.originalPrice && (
              <span className="text-[10px] line-through" style={{ color: 'var(--muted-fg)' }}>Rs. {item.originalPrice}</span>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => add({ menuItemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl })}
              className="h-7 w-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQty(item.id, qty - 1)}
                className="h-6 w-6 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: 'var(--card-border)' }}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty(item.id, qty + 1)}
                className="h-6 w-6 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-[110px] shrink-0 self-stretch overflow-hidden" style={{ backgroundColor: 'var(--card-border)' }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
        )}
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link href="/deals">
      <div className="group flex rounded-2xl overflow-hidden border transition-all duration-200 h-[110px]"
           style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start gap-1.5 mb-1">
              <span className="mt-px shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide text-emerald-400"
                    style={{ backgroundColor: 'rgba(52,211,153,0.1)' }}>
                Combo
              </span>
              <h3 className="font-heading font-bold text-[13px] leading-snug text-white line-clamp-2">{deal.title}</h3>
            </div>
            {deal.description && (
              <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: 'var(--muted-fg)' }}>{deal.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {deal.dealPrice && <span className="font-black text-sm" style={{ color: 'var(--primary)' }}>Rs. {deal.dealPrice}</span>}
            {deal.originalPrice && (
              <span className="text-[10px] line-through" style={{ color: 'var(--muted-fg)' }}>Rs. {deal.originalPrice}</span>
            )}
          </div>
        </div>
        <div className="w-[110px] shrink-0 self-stretch overflow-hidden" style={{ backgroundColor: 'var(--card-border)' }}>
          {deal.imageUrl ? (
            <img src={deal.imageUrl} alt={deal.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🏷️</div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function MenuSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(SEC_TOP);

  const sectionEls = useRef<Map<string, HTMLElement>>(new Map());
  const navRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/menu-items?available=true').then(r => r.json()),
      fetch('/api/deals?active=true').then(r => r.json()),
    ]).then(([cats, itms, dls]) => {
      setCategories(cats.filter((c: Category) => c.isActive));
      setItems(itms);
      setDeals(dls);
      setLoading(false);
    });
  }, []);

  const goToSection = useCallback((id: string) => {
    const el = sectionEls.current.get(id);
    if (!el) return;
    programmatic.current = true;
    setActiveSection(id);
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    setTimeout(() => { programmatic.current = false; }, 900);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector(`[data-id="${activeSection}"]`) as HTMLElement | null;
    if (tab && nav) {
      nav.scrollTo({ left: tab.offsetLeft - nav.offsetWidth / 2 + tab.offsetWidth / 2, behavior: 'smooth' });
    }
  }, [activeSection]);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmatic.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 },
    );
    sectionEls.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, categories, items, deals]);

  const featured = items.filter(i => i.isFeatured);
  const hasDeals = deals.length > 0;

  const navTabs = [
    { id: SEC_TOP, label: '🔥 Most Selling' },
    ...(hasDeals ? [{ id: SEC_DEALS, label: '🏷️ Deals' }] : []),
    ...categories.map(c => ({ id: `cat-${c.id}`, label: c.name })),
  ];

  return (
    <div>
      {/* Sticky category nav */}
      <div className="sticky top-16 z-20 backdrop-blur-md border-b"
           style={{ backgroundColor: 'rgba(21,24,31,0.95)', borderColor: 'var(--card-border)' }}>
        <div ref={navRef} className="flex gap-1.5 px-4 py-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-24 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: 'var(--card-border)' }} />
              ))
            : navTabs.map(({ id, label }) => (
                <button
                  key={id}
                  data-id={id}
                  onClick={() => goToSection(id)}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 shrink-0"
                  style={activeSection === id
                    ? { backgroundColor: 'var(--primary)', color: '#fff' }
                    : { color: 'var(--muted-fg)' }}
                >
                  {label}
                </button>
              ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-14">
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(g => (
              <div key={g}>
                <div className="h-7 w-44 mb-5 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--card-border)' }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[110px] rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--card)' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section id={SEC_TOP} ref={el => el && sectionEls.current.set(SEC_TOP, el)}>
                <SectionHeader
                  icon={<Flame className="h-5 w-5" style={{ color: 'var(--primary)' }} />}
                  title="Most Selling"
                  subtitle="Customers' all-time favourites"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featured.map(item => <ItemCard key={item.id} item={item} />)}
                </div>
              </section>
            )}

            {hasDeals && (
              <section id={SEC_DEALS} ref={el => el && sectionEls.current.set(SEC_DEALS, el)}>
                <SectionHeader
                  icon={<Tag className="h-5 w-5" style={{ color: 'var(--primary)' }} />}
                  title="Deals"
                  subtitle="Limited-time combo offers"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                </div>
              </section>
            )}

            {categories.map(cat => {
              const catItems = items.filter(i => i.categoryId === cat.id);
              if (catItems.length === 0) return null;
              const id = `cat-${cat.id}`;
              return (
                <section key={cat.id} id={id} ref={el => el && sectionEls.current.set(id, el)}>
                  <SectionHeader
                    title={cat.name}
                    subtitle={cat.description ?? undefined}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catItems.map(item => <ItemCard key={item.id} item={item} />)}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
