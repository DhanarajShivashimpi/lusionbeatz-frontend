import { ShoppingCart, IndianRupee } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AudioPlayer from "./AudioPlayer";
import type { Sample } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface SampleCardProps {
  sample: Sample;
}

export default function SampleCard({ sample }: SampleCardProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const addToCartMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/cart/add", { sampleId: sample.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${sample.title} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const buyNow = () => {
    addToCartMutation.mutate();
    setTimeout(() => setLocation("/cart"), 500);
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 group dark:border-primary/20 dark:card-hover-glow" data-testid={`card-sample-${sample.id}`}>
      <CardHeader className="p-0">
        {sample.coverUrl ? (
          <div className="aspect-square w-full overflow-hidden bg-muted dark:bg-primary/10">
            <img
              src={sample.coverUrl}
              alt={sample.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              data-testid={`img-cover-${sample.id}`}
            />
          </div>
        ) : (
          <div className="aspect-square w-full dark:bg-gradient-to-br dark:from-primary/20 dark:to-primary/5 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/20 dark:text-primary/30">
              {sample.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Waveform */}
        <AudioPlayer audioUrl={sample.audioUrl} height={48} />

        {/* Title */}
        <h3 className="font-semibold text-lg truncate" data-testid={`text-title-${sample.id}`}>
          {sample.title}
        </h3>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          {sample.bpm && (
            <Badge variant="secondary" className="dark:bg-primary/20 dark:text-primary dark:border-primary/30" data-testid={`badge-bpm-${sample.id}`}>
              {sample.bpm} BPM
            </Badge>
          )}
          {sample.key && (
            <Badge variant="secondary" className="dark:bg-primary/20 dark:text-primary dark:border-primary/30" data-testid={`badge-key-${sample.id}`}>
              {sample.key}
            </Badge>
          )}
          <Badge variant="secondary" className="dark:bg-primary/20 dark:text-primary dark:border-primary/30" data-testid={`badge-genre-${sample.id}`}>
            {sample.genre}
          </Badge>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-2xl font-bold" data-testid={`text-price-${sample.id}`}>
          <IndianRupee className="h-5 w-5" />
          {parseFloat(sample.price).toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 dark:border-primary/40 dark:hover:border-primary/60"
          onClick={() => addToCartMutation.mutate()}
          disabled={addToCartMutation.isPending}
          data-testid={`button-add-cart-${sample.id}`}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          variant="default"
          className="flex-1 dark:neon-glow"
          onClick={buyNow}
          disabled={addToCartMutation.isPending}
          data-testid={`button-buy-now-${sample.id}`}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
