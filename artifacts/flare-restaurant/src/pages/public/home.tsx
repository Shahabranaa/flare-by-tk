import { Link } from "wouter";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListMenuItems, useListDeals } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Home() {
  const { data: featuredItems, isLoading: itemsLoading } = useListMenuItems({ featured: true });
  const { data: deals, isLoading: dealsLoading } = useListDeals({ active: true });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
              Experience premium fast-casual Pakistani dining. From fire-grilled meats to our signature karahi, every bite is a celebration of authentic taste.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full font-bold bg-background/50 backdrop-blur">
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Signature Fire</h2>
              <p className="text-muted-foreground">Our most loved creations, straight from the grill.</p>
            </div>
            <Link href="/menu" className="hidden md:flex text-primary font-medium items-center hover:underline">
              Full Menu <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itemsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : featuredItems?.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/menu/${item.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-muted">
                    <img 
                      src={item.imageUrl || "/biryani.png"} 
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      Rs. {item.price}
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/menu">
              <Button variant="outline" className="rounded-full">View All Menu</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Active Deals Banner */}
      {!dealsLoading && deals && deals.length > 0 && (
        <section className="py-20">
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
                <p className="text-gray-300 text-lg mb-8">
                  {deals[0].description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-primary">
                    Rs. {deals[0].dealPrice}
                  </span>
                  {deals[0].originalPrice && (
                    <span className="text-xl text-gray-400 line-through decoration-destructive decoration-2">
                      Rs. {deals[0].originalPrice}
                    </span>
                  )}
                </div>
                <div className="mt-8">
                  <Link href="/deals">
                    <Button size="lg" className="rounded-full">Claim Offer</Button>
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
