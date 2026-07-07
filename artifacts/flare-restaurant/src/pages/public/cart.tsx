import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  orderType: z.enum(["delivery", "pickup"]),
  customerAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.orderType === "delivery" && (!data.customerAddress || data.customerAddress.length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Address is required for delivery",
      path: ["customerAddress"],
    });
  }
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createOrder = useCreateOrder();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      orderType: "delivery",
      customerAddress: "",
      specialInstructions: "",
    },
  });

  const orderType = form.watch("orderType");

  const onSubmit = (data: OrderFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering.",
        variant: "destructive",
      });
      return;
    }

    createOrder.mutate({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress || undefined,
        orderType: data.orderType,
        specialInstructions: data.specialInstructions || undefined,
        items: items.map(i => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity
        }))
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        toast({
          title: "Order Placed Successfully!",
          description: `Your order is being processed.`,
        });
        setLocation(`/order/${order.trackingToken}`);
      },
      onError: () => {
        toast({
          title: "Order Failed",
          description: "There was an error placing your order. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-3xl font-heading font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/menu">
          <Button size="lg" className="rounded-full px-8">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-heading font-black mb-6 md:mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="bg-card rounded-3xl border shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Order Details</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="orderType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Order Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 bg-secondary/50 px-4 py-3 rounded-xl border border-transparent has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5 transition-colors cursor-pointer flex-1">
                            <FormControl>
                              <RadioGroupItem value="delivery" />
                            </FormControl>
                            <FormLabel className="font-medium cursor-pointer w-full">Delivery</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 bg-secondary/50 px-4 py-3 rounded-xl border border-transparent has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5 transition-colors cursor-pointer flex-1">
                            <FormControl>
                              <RadioGroupItem value="pickup" />
                            </FormControl>
                            <FormLabel className="font-medium cursor-pointer w-full">Pickup</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Ali Khan" {...field} className="bg-secondary/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="0300 1234567" {...field} className="bg-secondary/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {orderType === "delivery" && (
                  <FormField
                    control={form.control}
                    name="customerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address (Bahawalpur Only)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="House #, Street, Block, Area..." 
                            {...field} 
                            className="bg-secondary/30 resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Less spicy, extra mayo..." 
                          {...field} 
                          className="bg-secondary/30 resize-none"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 rounded-full font-bold text-lg mt-8"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
                  {!createOrder.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="bg-card rounded-3xl border shadow-sm p-6 md:p-8 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-2xl font-heading font-bold">Your Order</h2>
              <span className="bg-secondary px-3 py-1 rounded-full text-sm font-bold text-muted-foreground">{items.length} items</span>
            </div>
            
            <div className="space-y-4 max-h-56 lg:max-h-[400px] overflow-y-auto pr-2 mb-6">
              {items.map((item) => (
                <div key={item.menuItemId} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img src={item.imageUrl || "/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold line-clamp-1 pr-2">{item.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                        onClick={() => removeFromCart(item.menuItemId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="font-bold text-primary">Rs. {item.price}</div>
                      <div className="flex items-center bg-secondary rounded-lg">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-none rounded-l-lg hover:bg-background"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-none rounded-r-lg hover:bg-background"
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>
              {orderType === "delivery" && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>Rs. 150</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-heading font-black pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">Rs. {orderType === "delivery" ? total + 150 : total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
