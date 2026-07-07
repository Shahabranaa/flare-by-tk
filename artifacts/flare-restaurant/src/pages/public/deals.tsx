import { useListDeals } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import { Link } from "wouter";

export function Deals() {
  const { data: deals, isLoading } = useListDeals({ active: true });

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Exclusive Deals</h1>
        <p className="text-muted-foreground text-lg">Massive flavors, incredible value. Grab these limited-time offers.</p>
      </div>

      {deals && deals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {deals.map(deal => (
            <div key={deal.id} className="bg-card rounded-3xl overflow-hidden border shadow-sm group">
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                <img 
                  src={deal.imageUrl || "/deal-combo.png"} 
                  alt={deal.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                    {deal.discountType === 'percentage' && `${deal.discountValue}% OFF`}
                    {deal.discountType === 'fixed' && `Rs. ${deal.discountValue} OFF`}
                    {deal.discountType === 'combo' && 'COMBO DEAL'}
                  </div>
                  <h3 className="text-xl sm:text-3xl font-heading font-bold text-white drop-shadow-md">{deal.title}</h3>
                </div>
              </div>
              <div className="p-5 md:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground flex-1 text-sm sm:text-base">
                  {deal.description}
                </p>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start shrink-0 gap-3">
                  <div className="flex items-baseline gap-2">
                    {deal.originalPrice && (
                      <span className="text-muted-foreground line-through text-base">Rs. {deal.originalPrice}</span>
                    )}
                    <span className="text-2xl sm:text-3xl font-black text-primary">Rs. {deal.dealPrice}</span>
                  </div>
                  <Link href="/">
                    <Button size="default" className="rounded-full font-bold px-6">Order Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
          <p className="text-xl text-muted-foreground mb-4">No active deals right now.</p>
          <Link href="/menu">
            <Button size="lg">Explore Our Menu</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
