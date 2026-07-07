import { ReactNode } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { useAuth, useUser, useClerk } from "@clerk/react";
import { LayoutDashboard, ShoppingBag, Utensils, FolderTree, Tag, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FullPageLoader } from "@/components/ui/loading-spinner";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Menu Items", href: "/admin/menu", icon: Utensils },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Deals", href: "/admin/deals", icon: Tag },
  ];

  const NavItems = () => (
    <nav className="flex-1 space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = location.startsWith(item.href);
        return (
          <Link key={item.name} href={item.href}>
            <span
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] flex bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="h-16 flex items-center px-6 border-b">
          <img src="/logo.svg" alt="Flare Admin" className="h-6" />
          <span className="ml-2 font-heading font-semibold text-sm text-muted-foreground tracking-wide">ADMIN</span>
        </div>
        <NavItems />
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.firstName?.[0] || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.fullName || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 border-b bg-card flex items-center px-4 justify-between">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Flare Admin" className="h-6" />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <div className="h-16 flex items-center px-6 border-b">
                <img src="/logo.svg" alt="Flare Admin" className="h-6" />
              </div>
              <NavItems />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <FullPageLoader />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;

  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}
