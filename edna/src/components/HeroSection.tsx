import { Dna, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { DNAHelix } from "./DNAHelix";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* DNA Helix decorations */}
      <div className="absolute left-10 top-1/4 opacity-30 hidden lg:block">
        <DNAHelix size="lg" />
      </div>
      <div className="absolute right-10 bottom-1/4 opacity-30 hidden lg:block">
        <DNAHelix size="md" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">
              Biodiversity Research Platform
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight animate-slide-up">
            Explore Life Through
            <span className="block mt-2 text-primary glow-text">
              e-DNA
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up stagger-2">
            Discover the hidden world of biodiversity through environmental DNA analysis. 
            Identify species, explore datasets, and unlock the secrets of life with AI-powered tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-3">
            <Link to="/dataset-hub">
              <Button variant="glow" size="xl" className="w-full sm:w-auto">
                <Dna className="w-5 h-5" />
                Explore Datasets
              </Button>
            </Link>
            <Link to="/species-identifier">
              <Button variant="glass" size="xl" className="w-full sm:w-auto">
                Identify Species
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-slide-up stagger-4">
            {[
              { value: "10K+", label: "DNA Samples" },
              { value: "500+", label: "Species" },
              { value: "AI", label: "Powered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
