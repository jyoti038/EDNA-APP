import { useMemo, useState } from "react";
import { Dna, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { DNAHelix } from "./DNAHelix";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const heroTransform = useMemo(
    () => ({ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }),
    [tilt]
  );

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden perspective-stage hero-motion"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const mouseX = (event.clientX - bounds.left) / bounds.width;
        const mouseY = (event.clientY - bounds.top) / bounds.height;
        setTilt({ x: (0.5 - mouseY) * 5, y: (mouseX - 0.5) * 7 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* Background image + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-zoom"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 scanline-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/65 to-background animate-gradient-shift" />

      {/* Dynamic 3D lights */}
      <div className="floating-orb orb-primary absolute top-20 left-10 hidden md:block" />
      <div className="floating-orb orb-accent absolute top-44 right-16 hidden md:block" />
      <div className="floating-orb orb-primary absolute bottom-20 right-1/4 hidden lg:block" />

      {Array.from({ length: 8 }).map((_, index) => (
        <span
          key={index}
          className="hero-particle hidden md:block"
          style={{
            left: `${12 + index * 11}%`,
            animationDelay: `${index * 0.7}s`,
            animationDuration: `${12 + (index % 4) * 2}s`,
          }}
        />
      ))}

      {/* DNA Helix decorations */}
      <div className="absolute left-10 top-1/4 opacity-30 hidden lg:block parallax-helix" style={heroTransform}>
        <DNAHelix size="lg" />
      </div>
      <div
        className="absolute right-10 bottom-1/4 opacity-30 hidden lg:block parallax-helix"
        style={{ transform: `rotateY(180deg) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <DNAHelix size="md" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center parallax-content" style={heroTransform}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Biodiversity Research Platform</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight animate-slide-up animate-float-soft">
            Explore Life Through
            <span className="block mt-2 text-primary glow-text">e-DNA</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up stagger-2">
            Discover the hidden world of biodiversity through environmental DNA analysis.
            Identify species, explore datasets, and unlock the secrets of life with AI-powered tools.
          </p>

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

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-slide-up stagger-4">
            {[
              { value: "10K+", label: "DNA Samples" },
              { value: "500+", label: "Species" },
              { value: "AI", label: "Powered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/60 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
