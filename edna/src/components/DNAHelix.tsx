import { cn } from "@/lib/utils";

interface DNAHelixProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const DNAHelix = ({ className, size = "md" }: DNAHelixProps) => {
  const sizeClasses = {
    sm: "w-16 h-32",
    md: "w-24 h-48",
    lg: "w-32 h-64",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 animate-dna-spin" style={{ transformStyle: "preserve-3d" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${i * 10}%`,
              transform: `translateX(-50%) rotateY(${i * 36}deg)`,
            }}
          >
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
              <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent" />
              <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
    </div>
  );
};
