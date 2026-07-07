import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FloatingCart } from "@/components/ui/floating-cart";
import { ReactNode } from "react";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
      >
        Menu
      </Link>
      <Link
        href="/deals"
        className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith("/deals") ? "text-primary" : "text-muted-foreground"}`}
      >
        Deals
      </Link>
      <Link
        href="/about"
        className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith("/about") ? "text-primary" : "text-muted-foreground"}`}
      >
        About Us
      </Link>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Flare by TK" className="h-8" />
            </Link>
            <nav className="hidden md:flex gap-6">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                  <div className="mt-4 border-t pt-4">
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start">
                        Staff Login
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card text-card-foreground">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.svg" alt="Flare by TK" className="h-8 mb-4 opacity-80" />
              <p className="text-muted-foreground text-sm max-w-xs">
                Premium fire-grilled meats, sizzling platters, and bold flavors near Dubai Chowk, Bahawalpur.
              </p>
              <p className="text-muted-foreground text-sm mt-3 font-medium">
                📞 0345-1116520
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Full Menu
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="hover:text-primary">
                    Offers & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    Our Story
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Visit Us</h4>
              <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>Near Dubai Chowk, Mehmood CNG</p>
                <p>Bahawalpur, Punjab, Pakistan</p>
                <p className="mt-3 font-medium text-foreground">0345-1116520</p>
              </address>
              <div className="mt-4">
                <Link href="/admin">
                  <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
                    Admin Portal
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Flare by TK. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating cart — hides on cart/checkout/admin pages */}
      <FloatingCart />
    </div>
  );
}
