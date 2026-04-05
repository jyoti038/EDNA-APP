import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  gradient?: string;
  delay?: string;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  to,
  gradient = "from-primary/20 to-accent/10",
  delay = "stagger-1",
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden animate-slide-up opacity-0",
        delay
      )}
    >
      {/* Background gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-500", gradient)} />
      
      {/* Card content */}
      <div className="relative glass-card rounded-2xl p-8 h-full flex flex-col bio-border group-hover:border-primary/50 transition-all duration-300">
        {/* Icon */}
        <div className="mb-6 relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Text */}
        <h3 className="font-display text-xl font-bold text-foreground mb-3 tracking-wide group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-6">
          {description}
        </p>

        {/* CTA */}
        <Link to={to}>
          <Button variant="outline" className="w-full group/btn">
            Explore
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
