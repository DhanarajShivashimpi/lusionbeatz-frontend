import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SampleCard from "@/components/SampleCard";
import type { Sample } from "@shared/schema";

export default function Loops() {
  const { data: samples, isLoading } = useQuery<Sample[]>({
    queryKey: ["/api/samples", { type: "loop", status: "approved" }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">
              Browse Loops
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover high-quality loop samples for your productions
            </p>
          </div>

          {/* Samples Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : samples && samples.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {samples.map((sample) => (
                <SampleCard key={sample.id} sample={sample} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No loops available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
