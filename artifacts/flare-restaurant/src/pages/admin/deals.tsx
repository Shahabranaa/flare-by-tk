import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { 
  useListDeals,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
  getListDealsQueryKey,
  DealInputDiscountType
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { FullPageLoader } from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const dealSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  discountType: z.enum(["percentage", "fixed", "combo"] as const),
  discountValue: z.coerce.number().optional().or(z.literal(0)),
  originalPrice: z.coerce.number().optional().or(z.literal(0)),
  dealPrice: z.coerce.number().min(0, "Deal price is required"),
  isActive: z.boolean().default(true),
});

type DealFormValues = z.infer<typeof dealSchema>;

export function DealsManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: deals, isLoading } = useListDeals();
  
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      discountType: "combo",
      discountValue: undefined,
      originalPrice: undefined,
      dealPrice: 0,
      isActive: true,
    },
  });

  const watchTitle = form.watch("title");
  const watchSlug = form.watch("slug");
  
  if (watchTitle && !watchSlug && !editingItem) {
    form.setValue("slug", watchTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      discountType: item.discountType,
      discountValue: item.discountValue || undefined,
      originalPrice: item.originalPrice || undefined,
      dealPrice: item.dealPrice || 0,
      isActive: item.isActive,
    });
    setIsOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    form.reset({
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      discountType: "combo",
      discountValue: undefined,
      originalPrice: undefined,
      dealPrice: 0,
      isActive: true,
    });
    setIsOpen(true);
  };

  const onSubmit = (data: DealFormValues) => {
    const cleanData = {
      ...data,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
      discountValue: data.discountValue || undefined,
      originalPrice: data.originalPrice || undefined,
    };

    if (editingItem) {
      updateDeal.mutate({
        id: editingItem.id,
        data: cleanData
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealsQueryKey() });
          toast({ title: "Deal updated" });
          setIsOpen(false);
        }
      });
    } else {
      createDeal.mutate({
        data: cleanData as any
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealsQueryKey() });
          toast({ title: "Deal created" });
          setIsOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteDeal.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDealsQueryKey() });
        toast({ title: "Deal deleted" });
      }
    });
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Deals & Offers</h1>
          <p className="text-muted-foreground">Manage promotional banners and combos.</p>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleOpenAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Deal
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>{editingItem ? "Edit Deal" : "Add Deal"}</SheetTitle>
            </SheetHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Family BBQ Combo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="family-combo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="combo">Combo Meal</SelectItem>
                            <SelectItem value="percentage">Percentage Off</SelectItem>
                            <SelectItem value="fixed">Fixed Discount</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dealPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Final Deal Price (Rs.)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (Rs.)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Optional" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What's included..." className="resize-none" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/deal-combo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-primary/5 border-primary/20">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-primary">Active Campaign</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-4" disabled={createDeal.isPending || updateDeal.isPending}>
                  {createDeal.isPending || updateDeal.isPending ? "Saving..." : "Save Deal"}
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals && deals.length > 0 ? (
              deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <div className="w-24 h-12 rounded bg-muted overflow-hidden border">
                      <img src={deal.imageUrl || "/deal-combo.png"} alt={deal.title} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold max-w-[200px] truncate">{deal.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="uppercase text-[10px]">{deal.discountType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-primary">Rs. {deal.dealPrice}</div>
                    {deal.originalPrice && <div className="text-xs text-muted-foreground line-through">Rs. {deal.originalPrice}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={deal.isActive ? "outline" : "secondary"} className={deal.isActive ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10" : ""}>
                      {deal.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(deal)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {deal.title}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure? This will remove the deal from the public site immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => handleDelete(deal.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No deals found. Create one to show on the public site.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
