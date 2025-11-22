import { Link } from "wouter";
import { Music, Disc, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden dark:bg-gradient-to-br dark:from-primary/5 dark:via-background dark:to-background">
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-primary/5 via-background to-background hidden dark:block" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center ring-4 ring-primary/20 dark:neon-glow dark:animate-neon-pulse">
                <Music className="h-12 w-12 text-primary" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight dark:drop-shadow-[0_0_25px_#9b5cff]">
              Premium Music Samples
              <br />
              <span className="text-primary">For Producers</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover high-quality loops and one-shots from top creators. Elevate your production with our curated collection.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/loops">
                <Button size="lg" className="dark:neon-glow" data-testid="button-browse-loops">
                  <Music className="h-5 w-5" />
                  Browse Loops
                </Button>
              </Link>
              <Link href="/oneshots">
                <Button size="lg" variant="outline" className="dark:border-primary/50 dark:hover:border-primary dark:hover:shadow-[0_0_15px_rgba(155,92,255,0.3)]" data-testid="button-browse-oneshots">
                  <Disc className="h-5 w-5" />
                  Browse One-Shots
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 dark:bg-gradient-to-b dark:from-primary/5 dark:to-transparent">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose LusionBeatz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center dark:border-primary/20 dark:card-hover-glow">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center dark:neon-glow">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Professional-grade samples from experienced producers and sound designers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Royalty Free</h3>
                <p className="text-sm text-muted-foreground">
                  Use our samples in your commercial releases without additional licensing fees.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">Creator Support</h3>
                <p className="text-sm text-muted-foreground">
                  70% of every purchase goes directly to the creators who made the samples.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                Ready to Create Amazing Music?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of producers who trust LusionBeatz for their sample needs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" data-testid="button-get-started">
                    Get Started
                  </Button>
                </Link>
                <a
                  href="https://wa.me/918073057412"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" data-testid="button-contact-cta">
                    Contact Us
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
