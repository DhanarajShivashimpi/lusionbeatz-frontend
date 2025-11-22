import { Link, useLocation } from "wouter";
import { ShoppingCart, LogIn, LogOut, User, Home, Music, Disc } from "lucide-react";
import { SiInstagram, SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [location] = useLocation();
  
  const { data: user } = useQuery({ queryKey: ["/api/auth/me"] });
  const { data: cartData } = useQuery<{ items: any[], total: number }>({ queryKey: ["/api/cart"] });
  
  const cartCount = cartData?.items?.length || 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 dark:bg-black/40 dark:border-primary/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg px-2 py-1">
            <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center dark:neon-glow">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight hidden sm:block">
              LusionBeatz
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={location === "/" ? "bg-accent" : ""}
                data-testid="link-home"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/loops">
              <Button
                variant="ghost"
                size="sm"
                className={location === "/loops" ? "bg-accent" : ""}
                data-testid="link-loops"
              >
                <Music className="h-4 w-4" />
                Loops
              </Button>
            </Link>
            <Link href="/oneshots">
              <Button
                variant="ghost"
                size="sm"
                className={location === "/oneshots" ? "bg-accent" : ""}
                data-testid="link-oneshots"
              >
                <Disc className="h-4 w-4" />
                One-Shots
              </Button>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Social Icons */}
            <a
              href="https://www.instagram.com/lusionbeatz?igsh=MXZ1bTI2Y3g0aWx1NQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block"
            >
              <Button variant="ghost" size="icon" data-testid="link-instagram">
                <SiInstagram className="h-4 w-4" />
              </Button>
            </a>
            <a
              href="https://www.youtube.com/@Lusionbeatz"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block"
            >
              <Button variant="ghost" size="icon" data-testid="link-youtube">
                <SiYoutube className="h-4 w-4" />
              </Button>
            </a>

            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/918073057412"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button variant="default" size="sm" className="dark:neon-glow" data-testid="button-contact">
                Contact
              </Button>
            </a>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="default" size="sm" data-testid="button-login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
