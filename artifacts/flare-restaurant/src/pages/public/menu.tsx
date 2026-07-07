import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Plus, Search } from "lucide-react";
import { useListCategories, useListMenuItems } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function Menu() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categorySlugFromUrl = params.get("category");

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const { data: menuItems, isLoading: itemsLoading } = useListMenuItems({ available: true });

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (categorySlugFromUrl && categories) {
      const match = categories.find((c) => c.slug === categorySlugFromUrl);
      if (match) setActiveCategoryId(match.id);
    }
  }, [categorySlugFromUrl, categories]);

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesCategory = activeCategoryId === null || item.categoryId === activeCategoryId;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategoryId, searchQuery]);

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
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Our Menu</h1>
        <p className="text-muted-foreground text-lg">
          Fire-grilled perfection. Choose from our premium selection of authentic Pakistani
          delicacies.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8 items-start md:items-center justify-between">
        <div className="w-full md:w-auto overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex items-center gap-2 min-w-max">
            <Button
              variant={activeCategoryId === null ? "default" : "secondary"}
              onClick={() => setActiveCategoryId(null)}
              className="rounded-full"
            >
              All Items
            </Button>
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))
              : categories
                  ?.filter((c) => c.isActive)
                  .map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategoryId === category.id ? "default" : "secondary"}
                      onClick={() => setActiveCategoryId(category.id)}
                      className="rounded-full"
                    >
                      {category.name}
                    </Button>
                  ))}
          </div>
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full bg-secondary/50 border-transparent focus-visible:ring-primary"
          />
        </div>
      </div>

      {itemsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/menu/${item.slug}`}>
              <div className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/30 cursor-pointer">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.isFeatured && (
                    <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                      Signature
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
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
                      className="rounded-full h-10 w-10 shrink-0"
                      onClick={(e) => handleAddToCart(e, item)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl">
          <p className="text-lg text-muted-foreground">
            No menu items found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setActiveCategoryId(null);
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
