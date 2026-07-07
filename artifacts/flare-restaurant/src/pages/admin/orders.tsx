import { useState } from "react";
import { useListOrders, useUpdateOrderStatus, OrderStatusUpdateStatus, getListOrdersQueryKey, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Eye, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: orders, isLoading } = useListOrders({
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    limit: 100
  });

  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: number, newStatus: OrderStatusUpdateStatus) => {
    updateStatus.mutate({
      id: orderId,
      data: { status: newStatus }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminDashboardQueryKey() });
        toast({
          title: "Status Updated",
          description: `Order #${orderId} status changed to ${newStatus}.`,
        });
      }
    });
  };

  if (isLoading) return <FullPageLoader />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "preparing": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "ready": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "completed": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and process customer orders.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>#{order.id}</span>
                      <span className="text-xs text-muted-foreground">{order.items.length} items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {order.orderType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    Rs. {order.totalAmount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(new Date(order.createdAt), "MMM d, h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(val) => handleStatusChange(order.id, val as OrderStatusUpdateStatus)}
                      disabled={order.status === "completed" || order.status === "cancelled"}
                    >
                      <SelectTrigger className={`w-[130px] h-8 text-xs font-semibold ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex justify-between items-center pr-4">
                            <span>Order #{order.id}</span>
                            <Badge className={`capitalize ${getStatusColor(order.status)}`}>{order.status}</Badge>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/50 p-4 rounded-xl">
                            <div>
                              <p className="text-muted-foreground font-medium mb-1">Customer</p>
                              <p className="font-bold">{order.customerName}</p>
                              <p>{order.customerPhone}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium mb-1">Type & Time</p>
                              <p className="font-bold capitalize">{order.orderType}</p>
                              <p>{format(new Date(order.createdAt), "MMM d, yyyy - h:mm a")}</p>
                            </div>
                            {order.orderType === "delivery" && order.customerAddress && (
                              <div className="col-span-2 mt-2">
                                <p className="text-muted-foreground font-medium mb-1">Address</p>
                                <p>{order.customerAddress}</p>
                              </div>
                            )}
                            {order.specialInstructions && (
                              <div className="col-span-2 mt-2">
                                <p className="text-muted-foreground font-medium mb-1">Instructions</p>
                                <p className="italic text-yellow-600 dark:text-yellow-500">"{order.specialInstructions}"</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                  <div className="flex items-center gap-3">
                                    <span className="bg-secondary text-secondary-foreground font-bold px-2 py-0.5 rounded text-sm">{item.quantity}x</span>
                                    <span>{item.name}</span>
                                  </div>
                                  <span className="font-medium">Rs. {item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t text-lg font-black">
                            <span>Total Amount</span>
                            <span className="text-primary">Rs. {order.totalAmount}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
