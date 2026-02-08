import { Link, useLocation } from "react-router-dom";
import { Dna, Database, Search, Gamepad2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home", icon: Dna },
  { to: "/dataset-hub", label: "Dataset Hub", icon: Database },
  { to: "/species-identifier", label: "Species ID", icon: Search },
  { to: "/dna-fusion", label: "DNA Fusion", icon: Gamepad2 },
];

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Dna className="w-8 h-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <span className="font-display text-xl font-bold text-foreground tracking-wider">
              eDNA <span className="text-primary">BioVerse</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive ? "glow" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "text-primary-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "glow" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "text-primary-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
