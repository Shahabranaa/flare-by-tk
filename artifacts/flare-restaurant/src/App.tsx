import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, useClerk } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider, useQueryClient, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import { CartProvider } from "@/lib/cart";

// Layouts
import { PublicLayout } from "@/components/layout/public-layout";
import { AdminRoute } from "@/components/layout/admin-layout";

// Public Pages
import { Home } from "@/pages/public/home";
import { Menu } from "@/pages/public/menu";
import { ItemDetail } from "@/pages/public/item-detail";
import { Deals } from "@/pages/public/deals";
import { Cart } from "@/pages/public/cart";
import { OrderTracking } from "@/pages/public/order-tracking";
import { About } from "@/pages/public/about";

// Admin Pages
import { Dashboard } from "@/pages/admin/dashboard";
import { Orders } from "@/pages/admin/orders";
import { MenuManagement } from "@/pages/admin/menu";
import { CategoryManagement } from "@/pages/admin/categories";
import { DealsManagement } from "@/pages/admin/deals";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}


const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(15, 100%, 50%)",
    colorForeground: "hsl(220, 20%, 10%)",
    colorMutedForeground: "hsl(220, 8%, 46%)",
    colorDanger: "hsl(0, 84%, 60%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInput: "hsl(220, 13%, 91%)",
    colorInputForeground: "hsl(220, 20%, 10%)",
    colorNeutral: "hsl(220, 13%, 91%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white dark:bg-[#1a1c23] rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-heading text-2xl font-bold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "font-medium",
    formFieldLabel: "font-medium",
    footerActionLink: "text-primary hover:text-primary/90 font-medium",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium",
    formFieldInput: "bg-background border-border text-foreground",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-muted/30 px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function PublicRoute({ component: Component }: { component: React.ComponentType<any> }) {
  return (
    <PublicLayout>
      <Component />
    </PublicLayout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={() => <PublicRoute component={Home} />} />
            <Route path="/menu" component={() => <PublicRoute component={Menu} />} />
            <Route path="/menu/:itemSlug" component={() => <PublicRoute component={ItemDetail} />} />
            <Route path="/deals" component={() => <PublicRoute component={Deals} />} />
            <Route path="/cart" component={() => <PublicRoute component={Cart} />} />
            <Route path="/order/:token" component={() => <PublicRoute component={OrderTracking} />} />
            <Route path="/about" component={() => <PublicRoute component={About} />} />

            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?">{() => <Redirect to="/sign-in" />}</Route>

            <Route path="/admin">
              {() => <Redirect to="/admin/dashboard" />}
            </Route>
            <Route path="/admin/dashboard" component={() => <AdminRoute component={Dashboard} />} />
            <Route path="/admin/orders" component={() => <AdminRoute component={Orders} />} />
            <Route path="/admin/menu" component={() => <AdminRoute component={MenuManagement} />} />
            <Route path="/admin/categories" component={() => <AdminRoute component={CategoryManagement} />} />
            <Route path="/admin/deals" component={() => <AdminRoute component={DealsManagement} />} />

            <Route component={NotFound} />
          </Switch>
        </CartProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <TooltipProvider>
        <ClerkProviderWithRoutes />
        <Toaster />
      </TooltipProvider>
    </WouterRouter>
  );
}

export default App;
