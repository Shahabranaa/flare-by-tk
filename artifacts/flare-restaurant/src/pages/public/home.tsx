import { Link } from "wouter";
import { ArrowRight, Flame, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListMenuItems, useListDeals, useListCategories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

export function Home() {
  const { data: featuredItems, isLoading: itemsLoading } = useListMenuItems({ featured: true });
  const { data: deals, isLoading: dealsLoading } = useListDeals({ active: true });
  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const { addToCart } = useCart();
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center">
        <div className="absolute inset-0">
          <img
            src="/hero-bbq.png"
            alt="Sizzling BBQ Platter"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent dark:from-background/95 dark:via-background/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Flame className="h-4 w-4" />
              <span>Sizzling in Bahawalpur</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight text-foreground leading-tight mb-6">
              BOLD FLAVORS.<br />
              <span className="text-primary">FIERY PASSION.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Experience premium fast-casual Pakistani dining. From fire-grilled meats to our
              signature karahi, every bite is a celebration of authentic taste.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/deals">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full font-bold bg-background/50 backdrop-blur"
                >
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse by Category ───────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-1">Browse by Category</h2>
              <p className="text-muted-foreground">Explore everything we have to offer.</p>
            </div>
            <Link href="/menu" className="hidden md:flex text-primary font-medium items-center hover:underline text-sm">
              Full Menu <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories?.filter((c) => c.isActive).map((cat) => (
                <Link key={cat.id} href={`/menu?category=${cat.slug}`}>
                  <div className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-heading font-bold text-sm leading-tight drop-shadow">
                        {cat.name}
                      </p>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/60 rounded-2xl transition-colors duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Signature Fire (Featured Items) ─────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-1">Signature Fire</h2>
              <p className="text-muted-foreground">Our most loved creations, straight from the grill.</p>
            </div>
            <Link href="/menu" className="hidden md:flex text-primary font-medium items-center hover:underline text-sm">
              Full Menu <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-4">
                    <Skeleton className="h-56 w-full rounded-2xl" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              : featuredItems?.slice(0, 6).map((item) => (
                  <Link key={item.id} href={`/menu/${item.slug}`}>
                    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <img
                          src={item.imageUrl || "/biryani.png"}
                          alt={item.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        {item.isFeatured && (
                          <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                            Signature
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                          Rs. {item.price}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-heading font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{item.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-black text-lg">Rs. {item.price}</span>
                            {item.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                Rs. {item.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button
                            size="icon"
                            className="rounded-full h-9 w-9 shrink-0"
                            onClick={(e) => handleAddToCart(e, item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Active Deals Banner ──────────────────────────────────────────── */}
      {!dealsLoading && deals && deals.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden bg-secondary">
              <div className="absolute inset-0">
                <img
                  src={deals[0].imageUrl || "/deal-combo.png"}
                  alt="Deal Banner"
                  className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent" />
              </div>
              <div className="relative z-10 p-8 md:p-16 max-w-2xl">
                <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-bold uppercase tracking-wider mb-4">
                  Limited Time Offer
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                  {deals[0].title}
                </h2>
                <p className="text-gray-300 text-lg mb-8">{deals[0].description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-primary">Rs. {deals[0].dealPrice}</span>
                  {deals[0].originalPrice && (
                    <span className="text-xl text-gray-400 line-through decoration-destructive decoration-2">
                      Rs. {deals[0].originalPrice}
                    </span>
                  )}
                </div>
                <div className="mt-8">
                  <Link href="/deals">
                    <Button size="lg" className="rounded-full">
                      Claim Offer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
