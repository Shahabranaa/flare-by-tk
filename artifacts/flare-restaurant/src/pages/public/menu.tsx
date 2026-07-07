import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Plus, Flame, Tag } from "lucide-react";
import { useListCategories, useListMenuItems, useListDeals } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SEC_MOST_SELLING = "most-selling";
const SEC_DEALS = "deals";

/* ── Sub-components ────────────────────────────────────────────────────── */

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-heading font-black tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5 ml-7">{subtitle}</p>}
    </div>
  );
}

function ItemCard({
  item,
  onAdd,
}: {
  item: any;
  onAdd: (e: React.MouseEvent, item: any) => void;
}) {
  return (
    <Link href={`/menu/${item.slug}`}>
      <div className="group flex bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/25 transition-all duration-200 cursor-pointer h-[108px]">
        {/* Left: text */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start gap-1.5 mb-1">
              {item.isFeatured && (
                <span className="mt-0.5 shrink-0 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                  Hot
                </span>
              )}
              <h3 className="font-heading font-bold text-[13px] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {item.name}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-sm">Rs. {item.price}</span>
              {item.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through">
                  Rs. {item.originalPrice}
                </span>
              )}
            </div>
            <Button
              size="icon"
              className="rounded-full h-7 w-7 shrink-0"
              onClick={(e) => onAdd(e, item)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {/* Right: image */}
        <div className="w-[108px] shrink-0 bg-muted self-stretch">
          <img
            src={item.imageUrl || "/placeholder.png"}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Link>
  );
}

function DealCard({ deal }: { deal: any }) {
  return (
    <Link href="/deals">
      <div className="group flex bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/25 transition-all duration-200 cursor-pointer h-[108px]">
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start gap-1.5 mb-1">
              <span className="mt-0.5 shrink-0 text-[9px] font-bold bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                Combo
              </span>
              <h3 className="font-heading font-bold text-[13px] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {deal.title}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {deal.description}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-black text-sm text-primary">Rs. {deal.dealPrice}</span>
            {deal.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                Rs. {deal.originalPrice}
              </span>
            )}
          </div>
        </div>
        <div className="w-[108px] shrink-0 bg-muted self-stretch">
          <img
            src={deal.imageUrl || "/deal-combo.png"}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Link>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────── */

export function Menu() {
  const [activeSection, setActiveSection] = useState(SEC_MOST_SELLING);
  const { data: categories, isLoading: catsLoading } = useListCategories();
  const { data: menuItems, isLoading: itemsLoading } = useListMenuItems({ available: true });
  const { data: deals } = useListDeals({ active: true });
  const { addToCart } = useCart();
  const { toast } = useToast();

  const sectionEls = useRef<Map<string, HTMLElement>>(new Map());
  const navRef = useRef<HTMLDivElement>(null);
  const programmaticScroll = useRef(false);

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl });
    toast({ title: "Added to Cart", description: `${item.name} added.` });
  };

  /* Scroll page to section */
  const goToSection = (id: string) => {
    const el = sectionEls.current.get(id);
    if (!el) return;
    programmaticScroll.current = true;
    setActiveSection(id);
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    setTimeout(() => { programmaticScroll.current = false; }, 900);
  };

  /* Keep active tab centred in nav strip */
  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector(`[data-id="${activeSection}"]`) as HTMLElement | null;
    if (tab && nav) {
      nav.scrollTo({ left: tab.offsetLeft - nav.offsetWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
    }
  }, [activeSection]);

  /* Scroll-spy via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticScroll.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 },
    );
    sectionEls.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories, menuItems, deals]);

  const featuredItems = menuItems?.filter((i) => i.isFeatured) ?? [];
  const activeCategories = categories?.filter((c) => c.isActive) ?? [];
  const hasDeals = !!deals?.length;
  const isLoading = itemsLoading || catsLoading;

  const navTabs = [
    { id: SEC_MOST_SELLING, label: "🔥 Most Selling" },
    ...(hasDeals ? [{ id: SEC_DEALS, label: "🏷️ Deals" }] : []),
    ...activeCategories.map((c) => ({ id: `cat-${c.id}`, label: c.name })),
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* ── Sticky category nav ──────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div
          ref={navRef}
          className="flex gap-1.5 px-4 py-2.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
              ))
            : navTabs.map(({ id, label }) => (
                <button
                  key={id}
                  data-id={id}
                  onClick={() => goToSection(id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 ${
                    activeSection === id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-8 space-y-14">
        {isLoading ? (
          /* Loading skeleton */
          <div className="space-y-12">
            {[1, 2, 3].map((g) => (
              <div key={g}>
                <Skeleton className="h-7 w-40 mb-5 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[108px] rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Most Selling */}
            {featuredItems.length > 0 && (
              <section
                id={SEC_MOST_SELLING}
                ref={(el) => el && sectionEls.current.set(SEC_MOST_SELLING, el)}
              >
                <SectionHeader
                  icon={<Flame className="h-5 w-5 text-primary" />}
                  title="Most Selling"
                  subtitle="Customers' all-time favourites"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featuredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onAdd={handleAddToCart} />
                  ))}
                </div>
              </section>
            )}

            {/* Deals */}
            {hasDeals && (
              <section
                id={SEC_DEALS}
                ref={(el) => el && sectionEls.current.set(SEC_DEALS, el)}
              >
                <SectionHeader
                  icon={<Tag className="h-5 w-5 text-primary" />}
                  title="Deals"
                  subtitle="Limited-time combo offers set by the restaurant"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deals!.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </section>
            )}

            {/* Per-category sections */}
            {activeCategories.map((cat) => {
              const catItems = menuItems?.filter((i) => i.categoryId === cat.id) ?? [];
              if (catItems.length === 0) return null;
              const id = `cat-${cat.id}`;
              return (
                <section
                  key={cat.id}
                  id={id}
                  ref={(el) => el && sectionEls.current.set(id, el)}
                >
                  <SectionHeader
                    title={cat.name}
                    subtitle={cat.description ?? undefined}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catItems.map((item) => (
                      <ItemCard key={item.id} item={item} onAdd={handleAddToCart} />
                    ))}
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

