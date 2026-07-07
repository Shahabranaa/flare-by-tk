import { useParams } from "wouter";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useListMenuItems } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { FullPageLoader } from "@/components/ui/loading-spinner";

export function ItemDetail() {
  const { itemSlug } = useParams<{ itemSlug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: menuItems, isLoading } = useListMenuItems();
  
  if (isLoading) return <FullPageLoader />;
  
  const item = menuItems?.find(i => i.slug === itemSlug);
  
  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <Link href="/menu">
          <Button>Back to Menu</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      imageUrl: item.imageUrl
    });
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${item.name} added to your cart.`,
    });
  };

  const relatedItems = menuItems?.filter(i => 
    i.categoryId === item.categoryId && i.id !== item.id && i.isAvailable
  ).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/menu" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
        <div className="rounded-3xl overflow-hidden bg-muted aspect-square max-h-[600px] shadow-xl">
          <img 
            src={item.imageUrl || "/placeholder.png"} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          {item.isFeatured && (
            <div className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-bold w-max mb-4">
              Signature Item
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 leading-tight">{item.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-primary">Rs. {item.price}</span>
            {item.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">Rs. {item.originalPrice}</span>
            )}
          </div>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 py-6 border-y border-border mb-8">
            <div className="flex items-center bg-secondary rounded-full p-1 border">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-background"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-background"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart — Rs. {item.price * quantity}
            </Button>
          </div>

          <div className="space-y-4">
            {item.categoryName && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{item.categoryName}</span>
              </div>
            )}
            {item.calories && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{item.calories} kcal</span>
              </div>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tags</span>
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="bg-secondary px-2 py-1 rounded text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedItems && relatedItems.length > 0 && (
        <div>
          <h3 className="text-2xl font-heading font-bold mb-8">You might also like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map(related => (
              <Link key={related.id} href={`/menu/${related.slug}`}>
                <div className="group cursor-pointer flex items-center gap-4 bg-card p-3 rounded-2xl border border-border hover:border-primary/50 transition-colors">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <img src={related.imageUrl || "/placeholder.png"} alt={related.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition-colors">{related.name}</h4>
                    <p className="font-black text-sm mt-1">Rs. {related.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
