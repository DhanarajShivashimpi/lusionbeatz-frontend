import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Copy, Check, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UPI_ID = "prhallad2@ybl";
const QR_CODE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23666'%3EQR Code Placeholder%3C/text%3E%3C/svg%3E";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"payment" | "utr">("payment");
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: cart } = useQuery<{ items: any[], total: number }>({ queryKey: ["/api/cart"] });

  const createOrderMutation = useMutation({
    mutationFn: (utrNumber: string) => apiRequest("POST", "/api/orders/create", { utr: utrNumber }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/my-purchases"] });
      toast({
        title: "Order confirmed!",
        description: "Check your email for download links.",
      });
      setLocation("/dashboard?tab=purchases");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast({ title: "UPI ID copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = () => {
    setStep("utr");
  };

  const handleSubmitUtr = () => {
    if (!utr || utr.length < 6) {
      toast({
        title: "Invalid UTR",
        description: "Please enter a valid UTR number",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(utr);
  };

  const items = cart?.items || [];
  const total = cart?.total || 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="py-12 text-center">
              <p className="text-lg mb-4">Your cart is empty</p>
              <Button onClick={() => setLocation("/loops")}>Browse Samples</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="font-heading text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{items.length} sample(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-sm font-medium">₹{parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    <span data-testid="text-checkout-total">{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            {step === "payment" ? (
              <Card>
                <CardHeader>
                  <CardTitle>UPI Payment</CardTitle>
                  <CardDescription>Scan QR or use UPI ID to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg border">
                      <img
                        src={QR_CODE_PLACEHOLDER}
                        alt="Payment QR Code"
                        className="w-48 h-48"
                        data-testid="img-qr-code"
                      />
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <div className="flex gap-2">
                      <Input
                        value={UPI_ID}
                        readOnly
                        className="font-mono"
                        data-testid="input-upi-id"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyUpiId}
                        data-testid="button-copy-upi"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePaid}
                    data-testid="button-i-have-paid"
                  >
                    I Have Paid
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Enter UTR Number</CardTitle>
                  <CardDescription>
                    Enter the 12-digit transaction reference number from your payment app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>UTR / Transaction ID</Label>
                    <Input
                      placeholder="123456789012"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      maxLength={20}
                      data-testid="input-utr"
                    />
                    <p className="text-xs text-muted-foreground">
                      Find this in your payment app under transaction details
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSubmitUtr}
                      disabled={createOrderMutation.isPending}
                      data-testid="button-submit-utr"
                    >
                      {createOrderMutation.isPending ? "Processing..." : "Confirm Payment"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep("payment")}
                      data-testid="button-back-payment"
                    >
                      Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
