import { Link } from "react-router-dom";
import { Dna, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative mb-8">
          <Dna className="w-24 h-24 text-primary mx-auto animate-pulse-glow" />
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        </div>
        <h1 className="font-display text-6xl font-bold text-foreground mb-4">
          4<span className="text-primary">0</span>4
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          This DNA sequence doesn't exist in our database.
        </p>
        <Link to="/">
          <Button variant="glow" size="lg">
            <Home className="w-5 h-5" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
