import { Link } from "wouter";
import { SiInstagram, SiYoutube } from "react-icons/si";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t dark:border-primary/20 bg-card dark:bg-black/30">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded dark:bg-primary/20 bg-primary/10 flex items-center justify-center dark:neon-glow">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading text-lg font-bold">LusionBeatz</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium music samples, loops, and one-shots for producers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loops" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Loops
                </Link>
              </li>
              <li>
                <Link href="/oneshots" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse One-Shots
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <a
                href="https://www.instagram.com/lusionbeatz?igsh=MXZ1bTI2Y3g0aWx1NQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="dark:border-primary/40 dark:hover:border-primary/60" data-testid="footer-link-instagram">
                  <SiInstagram className="h-4 w-4" />
                  Instagram
                </Button>
              </a>
              <a
                href="https://www.youtube.com/@Lusionbeatz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="dark:border-primary/40 dark:hover:border-primary/60" data-testid="footer-link-youtube">
                  <SiYoutube className="h-4 w-4" />
                  YouTube
                </Button>
              </a>
            </div>
            <a
              href="https://wa.me/918073057412"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="sm" className="dark:neon-glow" data-testid="footer-button-whatsapp">
                Contact on WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LusionBeatz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
