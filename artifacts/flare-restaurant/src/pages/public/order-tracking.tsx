import { useEffect } from "react";
import { useParams } from "wouter";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import { CheckCircle2, Clock, ChefHat, CheckSquare, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PublicOrder {
  id: number;
  trackingToken: string;
  orderType: string;
  status: string;
  totalAmount: number;
  items: { menuItemId: number; name: string; price: number; quantity: number }[];
  createdAt: string;
  specialInstructions: string | null;
}

async function fetchOrderByToken(token: string): Promise<PublicOrder> {
  const res = await fetch(`/api/orders/track/${token}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export function OrderTracking() {
  const { token } = useParams<{ token: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery<PublicOrder>({
    queryKey: ["order-track", token],
    queryFn: () => fetchOrderByToken(token!),
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) return;
    if (order?.status === "completed" || order?.status === "cancelled") return;

    const es = new EventSource(`/api/orders/track/${token}/events`);

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { status: string };
        queryClient.setQueryData<PublicOrder>(["order-track", token], (prev) => {
          if (!prev) return prev;
          return { ...prev, status: payload.status };
        });
      } catch {
      }
    };

    es.onerror = () => {
    };

    return () => {
      es.close();
    };
  }, [token, order?.status, queryClient]);

  if (isLoading) return <FullPageLoader />;

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/" className="text-primary font-medium hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case "new": return 1;
      case "preparing": return 2;
      case "ready": return 3;
      case "completed": return 4;
      default: return 0;
    }
  };

  const currentStep = getStatusStep(order.status);
  const isCancelled = order.status === "cancelled";

  const steps = [
    { num: 1, label: "Order Received", icon: Clock },
    { num: 2, label: "Preparing", icon: ChefHat },
    { num: 3, label: "Ready", icon: CheckSquare },
    { num: 4, label: "Completed", icon: CheckCircle2 },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </div>

      <div className="bg-card rounded-3xl border shadow-lg overflow-hidden">
        <div className="bg-primary/5 p-6 md:p-10 border-b text-center">
          <h1 className="text-3xl font-heading font-black mb-2">Order Confirmed</h1>
          <p className="text-muted-foreground font-medium">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="p-6 md:p-10">
          {isCancelled ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center mb-10">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">Order Cancelled</h2>
              <p className="text-destructive/80 font-medium">This order has been cancelled. Please contact us if you think this is a mistake.</p>
            </div>
          ) : (
            <div className="mb-12">
              <div className="relative flex justify-between">
                <div className="absolute top-6 left-0 right-0 h-1 bg-secondary rounded-full -z-10" />
                <div
                  className="absolute top-6 left-0 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out"
                  style={{ width: `${(currentStep - 1) * 33.33}%` }}
                />
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep >= step.num;
                  const isCurrent = currentStep === step.num;
                  return (
                    <div key={step.num} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-secondary text-muted-foreground border-2 border-background"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-heading font-bold mb-4 pb-2 border-b">Order Details</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary text-foreground font-bold px-2 py-0.5 rounded text-sm">{item.quantity}x</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t space-y-2">
              {order.orderType === "delivery" && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>Rs. 150</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-heading font-black pt-2">
                <span>Total</span>
                <span className="text-primary">Rs. {order.totalAmount}</span>
              </div>
            </div>
            {order.specialInstructions && (
              <div className="mt-6 p-4 bg-muted/30 rounded-xl border">
                <p className="text-sm text-muted-foreground font-medium mb-1">Special Instructions</p>
                <p className="font-medium italic">"{order.specialInstructions}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
