import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Trash2, IndianRupee, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  title: string;
  type: string;
  genre: string;
  price: string;
  coverUrl?: string;
}

interface CartData {
  items: CartItem[];
  total: number;
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: cart, isLoading } = useQuery<CartData>({ queryKey: ["/api/cart"] });

  const removeFromCartMutation = useMutation({
    mutationFn: (sampleId: string) => apiRequest("POST", "/api/cart/remove", { sampleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({ title: "Removed from cart" });
    },
  });

  const items = cart?.items || [];
  const total = cart?.total || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-heading text-4xl font-bold mb-8">Shopping Cart</h1>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                  <p className="text-muted-foreground">Add some samples to get started</p>
                </div>
                <Button onClick={() => setLocation("/loops")} data-testid="button-browse-samples">
                  Browse Samples
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} data-testid={`cart-item-${item.id}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {item.coverUrl ? (
                          <img
                            src={item.coverUrl}
                            alt={item.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary/40">
                              {item.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1" data-testid={`text-cart-item-title-${item.id}`}>
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.type} • {item.genre}
                          </p>
                          <div className="flex items-center gap-1 text-lg font-bold">
                            <IndianRupee className="h-4 w-4" />
                            {parseFloat(item.price).toFixed(2)}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCartMutation.mutate(item.id)}
                          disabled={removeFromCartMutation.isPending}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Items ({items.length})</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-5 w-5" />
                          <span data-testid="text-cart-total">{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setLocation("/checkout")}
                      data-testid="button-proceed-checkout"
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
