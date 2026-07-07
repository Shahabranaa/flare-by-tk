import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Flame, Tag, Plus, ArrowDown, ChevronDown } from "lucide-react";
import { useListCategories, useListMenuItems, useListDeals } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SEC_TOP = "most-selling";
const SEC_DEALS = "deals";

/* ─── Sub-components ──────────────────────────────────────────────────── */

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
    <div className="mb-6">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-2xl font-heading font-black tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1 ml-8">{subtitle}</p>
      )}
    </div>
  );
}

function ItemCard({ item, onAdd }: { item: any; onAdd: (e: React.MouseEvent, item: any) => void }) {
  return (
    <Link href={`/menu/${item.slug}`}>
      <div className="group flex bg-card border border-border/70 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-[110px]">
        <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start gap-1.5 mb-1">
              {item.isFeatured && (
                <span className="mt-px shrink-0 text-[9px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
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
          <div className="flex items-center justify-between mt-1.5">
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
              className="rounded-full h-7 w-7 shrink-0 shadow-sm"
              onClick={(e) => onAdd(e, item)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="w-[110px] shrink-0 bg-muted self-stretch">
          <img
            src={item.imageUrl || "/placeholder.png"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </Link>
  );
}

function DealCard({ deal }: { deal: any }) {
  return (
    <Link href="/deals">
      <div className="group flex bg-card border border-border/70 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-[110px]">
        <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start gap-1.5 mb-1">
              <span className="mt-px shrink-0 text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
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
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-black text-sm text-primary">Rs. {deal.dealPrice}</span>
            {deal.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                Rs. {deal.originalPrice}
              </span>
            )}
          </div>
        </div>
        <div className="w-[110px] shrink-0 bg-muted self-stretch">
          <img
            src={deal.imageUrl || "/deal-combo.png"}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */

export function Home() {
  const [activeSection, setActiveSection] = useState(SEC_TOP);
  const { data: categories, isLoading: catsLoading } = useListCategories();
  const { data: menuItems, isLoading: itemsLoading } = useListMenuItems({ available: true });
  const { data: deals } = useListDeals({ active: true });
  const { addToCart } = useCart();
  const { toast } = useToast();

  const sectionEls = useRef<Map<string, HTMLElement>>(new Map());
  const navRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const menuSectionRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    });
    toast({ title: "Added to Cart", description: `${item.name} added.` });
  };

  const scrollToMenuSection = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const goToSection = (id: string) => {
    const el = sectionEls.current.get(id);
    if (!el) return;
    programmatic.current = true;
    setActiveSection(id);
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    setTimeout(() => { programmatic.current = false; }, 900);
  };

  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector(`[data-id="${activeSection}"]`) as HTMLElement | null;
    if (tab && nav) {
      nav.scrollTo({ left: tab.offsetLeft - nav.offsetWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
    }
  }, [activeSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmatic.current) return;
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
    { id: SEC_TOP, label: "🔥 Most Selling" },
    ...(hasDeals ? [{ id: SEC_DEALS, label: "🏷️ Deals" }] : []),
    ...activeCategories.map((c) => ({ id: `cat-${c.id}`, label: c.name })),
  ];

  return (
    <div className="min-h-screen pb-28">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden" style={{ height: "92vh", minHeight: 580 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/hero-bbq.png"
            alt=""
            className="w-full h-full object-cover object-center scale-[1.03]"
          />
          {/* Layered overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          {/* Bottom bleed into background */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-[0.12em] mb-8">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Open Now · Bahawalpur, Pakistan
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black tracking-tighter text-white leading-[0.88] mb-6"
                style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}>
              FLARE<br />
              <span className="text-primary">BY TK.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-white/60 max-w-sm leading-relaxed mb-10">
              Fire-grilled meats, bold flavors, and Bahawalpur's finest fast-casual dining — order in minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={scrollToMenuSection}
                className="h-13 px-8 text-base font-bold rounded-full shadow-lg shadow-primary/30 gap-2.5"
                style={{ height: "3.25rem" }}
              >
                Order Now
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Link href="/deals">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 text-base font-bold rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 backdrop-blur-sm"
                  style={{ height: "3.25rem" }}
                >
                  View Deals
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-5 mt-12 text-sm text-white/40">
              <div>
                <span className="text-white font-bold">68+</span> menu items
              </div>
              <div className="h-3 w-px bg-white/15" />
              <div>
                <span className="text-white font-bold">Rs. 150</span> delivery
              </div>
              <div className="h-3 w-px bg-white/15" />
              <div>Cash on delivery</div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* ── Menu section ──────────────────────────────────────────────── */}
      <div ref={menuSectionRef} id="menu-section">

        {/* Sticky category nav */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm">
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
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 shrink-0 ${
                      activeSection === id
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-10 space-y-14">
          {isLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((g) => (
                <div key={g}>
                  <Skeleton className="h-7 w-44 mb-6 rounded-lg" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-[110px] rounded-2xl" />
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
                  id={SEC_TOP}
                  ref={(el) => el && sectionEls.current.set(SEC_TOP, el)}
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
                    subtitle="Limited-time combo offers"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {deals!.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                </section>
              )}

              {/* Category sections */}
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
    </div>
  );
}
