import { Link, useLocation } from "wouter";
import { ShoppingBag, ArrowRight, X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FloatingCart() {
  const [location] = useLocation();
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  const hidden =
    location.startsWith("/cart") ||
    location.startsWith("/admin") ||
    location.startsWith("/order/");

  if (hidden || count === 0) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed bottom-0 inset-x-0 z-50 sm:inset-x-auto sm:right-5 sm:bottom-20 sm:w-96 bg-card border border-border rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-base">Your Cart</span>
              <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border min-h-0">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex items-center gap-3 px-5 py-3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl object-cover shrink-0 bg-muted"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Rs. {Number(item.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="h-7 w-7 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="h-7 w-7 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-muted/30 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery fee</span>
              <span className="font-bold">Rs. 150</span>
            </div>
            <div className="flex items-center justify-between font-black text-base border-t border-border pt-3">
              <span>Total</span>
              <span>Rs. {(total + 150).toLocaleString()}</span>
            </div>
            <Link href="/cart" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-xl h-12 font-bold text-base gap-2">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pill button */}
      <div className="fixed bottom-5 inset-x-4 z-50 sm:inset-x-auto sm:right-5 sm:w-80">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3.5 rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-white/20 font-black text-sm shrink-0">
            {count}
          </div>
          <span className="flex-1 text-left font-bold text-sm">
            {open ? "Close Cart" : "View Cart"}
          </span>
          <span className="font-black text-sm">Rs. {total.toLocaleString()}</span>
          <ArrowRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
    </>
  );
}
