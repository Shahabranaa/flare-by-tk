import { useParams } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import { CheckCircle2, Clock, ChefHat, CheckSquare, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || "0", 10);
  
  const { data: order, isLoading } = useGetOrder(orderId, {
    query: {
      enabled: !!orderId,
      refetchInterval: (query) => {
        // Stop refetching if completed or cancelled
        if (query.state.data?.status === "completed" || query.state.data?.status === "cancelled") {
          return false;
        }
        return 5000; // Poll every 5 seconds
      }
    }
  });

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
          <h1 className="text-3xl font-heading font-black mb-2">Order #{order.id}</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {order.totalAmount - (order.orderType === "delivery" ? 150 : 0)}</span>
                </div>
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
            </div>

            <div className="bg-secondary/30 p-6 rounded-2xl border">
              <h3 className="text-lg font-heading font-bold mb-4">Customer Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground font-medium">Name</dt>
                  <dd className="font-bold text-base">{order.customerName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Phone</dt>
                  <dd className="font-bold text-base">{order.customerPhone}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-medium">Type</dt>
                  <dd className="font-bold text-base capitalize bg-primary/10 text-primary inline-block px-2 py-0.5 rounded mt-1">{order.orderType}</dd>
                </div>
                {order.customerAddress && (
                  <div>
                    <dt className="text-muted-foreground font-medium">Address</dt>
                    <dd className="font-medium mt-1">{order.customerAddress}</dd>
                  </div>
                )}
                {order.specialInstructions && (
                  <div>
                    <dt className="text-muted-foreground font-medium">Instructions</dt>
                    <dd className="font-medium mt-1 italic">"{order.specialInstructions}"</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
