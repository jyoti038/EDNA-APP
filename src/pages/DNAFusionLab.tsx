import { useState, useEffect } from "react";
import { Dna, Sparkles, Loader2, RefreshCw, Zap, Atom, FlaskConical, Brain, Heart, Shield, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HybridResult {
  name: string;
  type: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  characteristics: {
    size: string;
    habitat: string;
    specialAbility: string;
    diet: string;
    lifespan: string;
    intelligence: number;
    strength: number;
    agility: number;
    defense: number;
  };
  description: string;
  funFact: string;
  dnaSequence: string;
}

const dnaOptions = [
  { id: "lion", label: "Lion", emoji: "🦁", type: "Mammal", color: "from-amber-500 to-orange-600" },
  { id: "eagle", label: "Eagle", emoji: "🦅", type: "Bird", color: "from-slate-400 to-slate-600" },
  { id: "shark", label: "Shark", emoji: "🦈", type: "Fish", color: "from-blue-500 to-cyan-600" },
  { id: "snake", label: "Snake", emoji: "🐍", type: "Reptile", color: "from-green-500 to-emerald-600" },
  { id: "octopus", label: "Octopus", emoji: "🐙", type: "Mollusk", color: "from-purple-500 to-pink-600" },
  { id: "butterfly", label: "Butterfly", emoji: "🦋", type: "Insect", color: "from-pink-400 to-rose-500" },
  { id: "tree", label: "Oak Tree", emoji: "🌳", type: "Plant", color: "from-green-600 to-lime-500" },
  { id: "mushroom", label: "Mushroom", emoji: "🍄", type: "Fungi", color: "from-red-500 to-orange-500" },
  { id: "jellyfish", label: "Jellyfish", emoji: "🪼", type: "Cnidarian", color: "from-cyan-400 to-blue-500" },
  { id: "firefly", label: "Firefly", emoji: "✨", type: "Insect", color: "from-yellow-400 to-amber-500" },
  { id: "wolf", label: "Wolf", emoji: "🐺", type: "Mammal", color: "from-gray-500 to-slate-700" },
  { id: "dragon", label: "Dragon", emoji: "🐉", type: "Mythical", color: "from-red-600 to-orange-500" },
];

const generateDNASequence = () => {
  const bases = ["A", "T", "C", "G"];
  return Array.from({ length: 48 }, () => bases[Math.floor(Math.random() * 4)]).join("");
};

const generateHybrid = (dnaA: string, dnaB: string): HybridResult => {
  const hybrids: Record<string, Partial<HybridResult>> = {
    "lion-eagle": {
      name: "Gryphon Rex",
      type: "Mythical Beast",
      rarity: "Legendary",
      characteristics: {
        size: "Large (2.5m wingspan, 200kg)",
        habitat: "Mountain peaks and savanna highlands",
        specialAbility: "Sonic roar that can stun prey from above",
        diet: "Carnivore - hunts large mammals and fish",
        lifespan: "150-200 years",
        intelligence: 85,
        strength: 92,
        agility: 88,
        defense: 78,
      },
      description: "A majestic fusion of the king of beasts and the master of skies. This creature combines the raw power of a lion with the aerial supremacy of an eagle.",
      funFact: "The Gryphon Rex can spot prey from 3 miles away while soaring and dive at speeds up to 150 mph!",
    },
    "shark-octopus": {
      name: "Krakenshark",
      type: "Deep Sea Predator",
      rarity: "Legendary",
      characteristics: {
        size: "Massive (8m length, 500kg)",
        habitat: "Deep ocean trenches and coral reefs",
        specialAbility: "Eight tentacles with razor-sharp teeth for multi-directional attacks",
        diet: "Apex predator - consumes anything",
        lifespan: "300+ years",
        intelligence: 95,
        strength: 98,
        agility: 75,
        defense: 85,
      },
      description: "The ultimate marine predator combining the hunting efficiency of a shark with the intelligence and adaptability of an octopus.",
      funFact: "Can change color while attacking and has three hearts that pump blue blood!",
    },
    "butterfly-firefly": {
      name: "Lumina Papillon",
      type: "Bioluminescent Insect",
      rarity: "Epic",
      characteristics: {
        size: "Small (15cm wingspan)",
        habitat: "Enchanted forests and twilight meadows",
        specialAbility: "Creates mesmerizing light patterns for communication and defense",
        diet: "Nectar and starlight energy",
        lifespan: "2-3 years",
        intelligence: 45,
        strength: 15,
        agility: 95,
        defense: 30,
      },
      description: "A ethereal creature that combines the delicate beauty of butterflies with the magical glow of fireflies.",
      funFact: "Their light show can hypnotize predators and attract mates from over 2 kilometers away!",
    },
    "tree-mushroom": {
      name: "Mycowood Titan",
      type: "Symbiotic Megaflora",
      rarity: "Epic",
      characteristics: {
        size: "Colossal (30m height)",
        habitat: "Ancient forests and underground cavern systems",
        specialAbility: "Creates vast underground networks sharing nutrients across entire ecosystems",
        diet: "Photosynthesis and decomposition",
        lifespan: "1000+ years",
        intelligence: 70,
        strength: 65,
        agility: 5,
        defense: 99,
      },
      description: "A revolutionary life form merging the structural majesty of oak trees with the networked intelligence of fungal systems.",
      funFact: "A single Mycowood Titan can communicate with thousands of other plants through its fungal network!",
    },
    "snake-jellyfish": {
      name: "Venomglide",
      type: "Aquatic Serpent",
      rarity: "Rare",
      characteristics: {
        size: "Medium (3m length)",
        habitat: "Tropical waters and coastal mangroves",
        specialAbility: "Combines paralytic venom with bioluminescent lures",
        diet: "Small fish and crustaceans",
        lifespan: "50-80 years",
        intelligence: 55,
        strength: 60,
        agility: 85,
        defense: 45,
      },
      description: "An otherworldly predator that slithers through water with jellyfish-like transparency and deadly serpentine precision.",
      funFact: "Its tentacles can deliver different types of venom while its translucent body makes it nearly invisible!",
    },
    "wolf-dragon": {
      name: "Fenrir Draconis",
      type: "Mythical Apex Predator",
      rarity: "Legendary",
      characteristics: {
        size: "Enormous (5m height, 1000kg)",
        habitat: "Volcanic mountains and frozen tundras",
        specialAbility: "Breathes elemental fire and ice, pack hunting intelligence",
        diet: "Carnivore - legendary beasts",
        lifespan: "Immortal",
        intelligence: 98,
        strength: 99,
        agility: 90,
        defense: 95,
      },
      description: "The ultimate fusion of canine pack loyalty and draconic power. This creature leads armies of lesser beings with unmatched strategic brilliance.",
      funFact: "Legends say Fenrir Draconis can speak all languages and commands respect from even gods!",
    },
  };

  const key = [dnaA, dnaB].sort().join("-");
  const baseHybrid = hybrids[key];
  
  const rarities: Array<"Common" | "Rare" | "Epic" | "Legendary"> = ["Common", "Rare", "Epic", "Legendary"];
  const randomRarity = rarities[Math.floor(Math.random() * 3)];
  
  return {
    name: baseHybrid?.name || `${dnaA.charAt(0).toUpperCase() + dnaA.slice(1)}${dnaB.charAt(0).toUpperCase() + dnaB.slice(1)}us`,
    type: baseHybrid?.type || "Experimental Hybrid",
    rarity: baseHybrid?.rarity || randomRarity,
    characteristics: baseHybrid?.characteristics || {
      size: "Variable (adapts to environment)",
      habitat: "Diverse biomes worldwide",
      specialAbility: "Combines traits from both parent species in unexpected ways",
      diet: "Omnivore - highly adaptable",
      lifespan: "Unknown - still being studied",
      intelligence: Math.floor(Math.random() * 40) + 50,
      strength: Math.floor(Math.random() * 40) + 50,
      agility: Math.floor(Math.random() * 40) + 50,
      defense: Math.floor(Math.random() * 40) + 50,
    },
    description: baseHybrid?.description || `A unique fusion combining the genetic traits of ${dnaA} and ${dnaB}, creating an entirely new form of life never seen before in nature.`,
    funFact: baseHybrid?.funFact || "This hybrid exhibits emergent behaviors that neither parent species possesses!",
    dnaSequence: generateDNASequence(),
  };
};

const StatBar = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1 text-muted-foreground">
        <Icon className="w-3 h-3" />
        {label}
      </span>
      <span className={cn("font-bold", color)}>{value}</span>
    </div>
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <div 
        className={cn("h-full rounded-full transition-all duration-1000 ease-out", color.replace("text-", "bg-"))}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const DNAStrand = ({ sequence, isAnimating }: { sequence: string; isAnimating: boolean }) => {
  return (
    <div className="flex flex-wrap justify-center gap-0.5 p-4 bg-background/50 rounded-lg font-mono text-xs">
      {sequence.split("").map((base, i) => (
        <span
          key={i}
          className={cn(
            "w-5 h-5 flex items-center justify-center rounded transition-all duration-300",
            base === "A" && "bg-red-500/20 text-red-400",
            base === "T" && "bg-blue-500/20 text-blue-400",
            base === "C" && "bg-green-500/20 text-green-400",
            base === "G" && "bg-yellow-500/20 text-yellow-400",
            isAnimating && "animate-pulse"
          )}
          style={{ animationDelay: `${i * 30}ms` }}
        >
          {base}
        </span>
      ))}
    </div>
  );
};

const FloatingParticle = ({ delay }: { delay: number }) => (
  <div 
    className="absolute w-2 h-2 rounded-full bg-primary/30 animate-particle-float"
    style={{ 
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`
    }}
  />
);

const RarityBadge = ({ rarity }: { rarity: string }) => {
  const colors = {
    Common: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    Rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Legendary: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 animate-pulse",
  };
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", colors[rarity as keyof typeof colors])}>
      {rarity === "Legendary" && "⭐ "}{rarity}
    </span>
  );
};

const DNAFusionLab = () => {
  const [dnaA, setDnaA] = useState("");
  const [dnaB, setDnaB] = useState("");
  const [customDnaA, setCustomDnaA] = useState("");
  const [customDnaB, setCustomDnaB] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HybridResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [fusionStage, setFusionStage] = useState("");
  const [showDnaAnimation, setShowDnaAnimation] = useState(false);

  const fusionStages = [
    "Extracting DNA samples...",
    "Analyzing genetic sequences...",
    "Mapping chromosomes...",
    "Splicing DNA strands...",
    "Combining genetic markers...",
    "Stabilizing hybrid genome...",
    "Generating organism profile...",
    "Fusion complete!"
  ];

  const handleMerge = async () => {
    const finalDnaA = dnaA || customDnaA;
    const finalDnaB = dnaB || customDnaB;

    if (!finalDnaA || !finalDnaB) {
      toast.error("Please select or enter both DNA samples");
      return;
    }

    if (finalDnaA === finalDnaB) {
      toast.error("Please select different DNA samples");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResult(null);
    setShowDnaAnimation(true);

    // Simulate DNA fusion process with stages
    for (let i = 0; i <= 100; i += 12.5) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setProgress(Math.min(i, 100));
      setFusionStage(fusionStages[Math.floor(i / 12.5)] || fusionStages[0]);
    }

    const hybrid = generateHybrid(finalDnaA, finalDnaB);
    setResult(hybrid);
    setIsLoading(false);
    setShowDnaAnimation(false);
    toast.success("DNA Fusion Complete!", {
      description: `Created: ${hybrid.name} (${hybrid.rarity})`,
    });
  };

  const handleReset = () => {
    setDnaA("");
    setDnaB("");
    setCustomDnaA("");
    setCustomDnaB("");
    setResult(null);
    setProgress(0);
    setFusionStage("");
  };

  const selectedDnaA = dnaOptions.find(o => o.id === dnaA);
  const selectedDnaB = dnaOptions.find(o => o.id === dnaB);

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 mb-6">
            <FlaskConical className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-pink-400 font-medium">Genetic Laboratory</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            DNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-accent">Fusion Lab</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Select two organisms and witness the creation of never-before-seen hybrid species.
            Discover unique abilities, traits, and characteristics!
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* DNA Selection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* DNA A */}
            <div className="glass-card rounded-2xl p-6 bio-border animate-slide-up stagger-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Dna className="w-5 h-5 text-primary" />
                </div>
                DNA Sample A
                {selectedDnaA && (
                  <span className="ml-auto text-2xl">{selectedDnaA.emoji}</span>
                )}
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dnaOptions.slice(0, 6).map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setDnaA(option.id);
                      setCustomDnaA("");
                    }}
                    className={cn(
                      "group relative p-4 rounded-xl text-center transition-all duration-300 overflow-hidden",
                      dnaA === option.id
                        ? "ring-2 ring-primary shadow-lg shadow-primary/20 scale-105"
                        : "bg-secondary/50 hover:bg-secondary hover:scale-102"
                    )}
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity",
                      option.color,
                      dnaA === option.id && "opacity-20"
                    )} />
                    <div className="relative">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.emoji}</div>
                      <div className="text-sm font-medium text-foreground">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.type}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Input
                  placeholder="Or type a custom species..."
                  value={customDnaA}
                  onChange={(e) => {
                    setCustomDnaA(e.target.value);
                    setDnaA("");
                  }}
                  className="bg-background/50 border-border/50 h-12"
                />
              </div>
            </div>

            {/* DNA B */}
            <div className="glass-card rounded-2xl p-6 bio-border animate-slide-up stagger-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
              <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Atom className="w-5 h-5 text-accent" />
                </div>
                DNA Sample B
                {selectedDnaB && (
                  <span className="ml-auto text-2xl">{selectedDnaB.emoji}</span>
                )}
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dnaOptions.slice(6).map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setDnaB(option.id);
                      setCustomDnaB("");
                    }}
                    className={cn(
                      "group relative p-4 rounded-xl text-center transition-all duration-300 overflow-hidden",
                      dnaB === option.id
                        ? "ring-2 ring-accent shadow-lg shadow-accent/20 scale-105"
                        : "bg-secondary/50 hover:bg-secondary hover:scale-102"
                    )}
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity",
                      option.color,
                      dnaB === option.id && "opacity-20"
                    )} />
                    <div className="relative">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.emoji}</div>
                      <div className="text-sm font-medium text-foreground">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.type}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Input
                  placeholder="Or type a custom species..."
                  value={customDnaB}
                  onChange={(e) => {
                    setCustomDnaB(e.target.value);
                    setDnaB("");
                  }}
                  className="bg-background/50 border-border/50 h-12"
                />
              </div>
            </div>
          </div>

          {/* Fusion Controls */}
          <div className="flex flex-col items-center gap-6 mb-12 animate-slide-up stagger-3">
            {/* Progress Section */}
            {isLoading && (
              <div className="w-full max-w-lg glass-card rounded-2xl p-6 bio-border">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-primary font-medium animate-pulse">{fusionStage}</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-pink-500 to-accent rounded-full transition-all duration-300 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                
                {/* DNA Helix Animation */}
                <div className="mt-6 flex justify-center">
                  <div className="relative h-20 w-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-30" style={{ animationDuration: "3s" }} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Dna className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="bio"
                size="xl"
                onClick={handleMerge}
                disabled={isLoading}
                className="relative overflow-hidden group px-8 py-6 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-pink-500 to-accent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Fusing DNA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      <span>Initiate Fusion</span>
                      <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </div>
              </Button>

              {(result || dnaA || dnaB || customDnaA || customDnaB) && (
                <Button variant="outline" size="xl" onClick={handleReset} className="px-6">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="animate-scale-in">
              <div className="glass-card rounded-3xl overflow-hidden border-2 border-pink-500/30 hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10">
                {/* Header with Dynamic Background */}
                <div className="relative p-8 md:p-12 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-pink-500/20 to-accent/30" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.1),transparent_50%)]" />
                  
                  {/* Animated Particles */}
                  <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-primary/50 animate-ping" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-accent/50 animate-ping" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-1/2 right-8 w-2 h-2 rounded-full bg-pink-500/50 animate-ping" style={{ animationDelay: "1s" }} />
                  
                  <div className="relative text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <RarityBadge rarity={result.rarity} />
                      <span className="px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-sm text-muted-foreground">
                        {result.type}
                      </span>
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-accent">
                        {result.name}
                      </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {result.description}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 space-y-8">
                  {/* DNA Sequence Visualization */}
                  <div>
                    <h4 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Dna className="w-4 h-4" />
                      Hybrid DNA Sequence
                    </h4>
                    <DNAStrand sequence={result.dnaSequence} isAnimating={false} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBar label="Intelligence" value={result.characteristics.intelligence} icon={Brain} color="text-blue-400" />
                    <StatBar label="Strength" value={result.characteristics.strength} icon={Zap} color="text-red-400" />
                    <StatBar label="Agility" value={result.characteristics.agility} icon={Wind} color="text-green-400" />
                    <StatBar label="Defense" value={result.characteristics.defense} icon={Shield} color="text-amber-400" />
                  </div>

                  {/* Characteristics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Size", value: result.characteristics.size, color: "primary" },
                      { label: "Habitat", value: result.characteristics.habitat, color: "accent" },
                      { label: "Diet", value: result.characteristics.diet, color: "pink-400" },
                      { label: "Lifespan", value: result.characteristics.lifespan, color: "blue-400" },
                      { label: "Special Ability", value: result.characteristics.specialAbility, color: "amber-400", span: 2 },
                    ].map((item, i) => (
                      <div 
                        key={i}
                        className={cn(
                          "p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-border transition-colors",
                          item.span === 2 && "md:col-span-2 lg:col-span-1"
                        )}
                      >
                        <h4 className={cn("font-display text-xs font-semibold mb-2 uppercase tracking-wider", `text-${item.color}`)}>
                          {item.label}
                        </h4>
                        <p className="text-foreground text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Fun Fact */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-pink-500/10 to-accent/10 border border-pink-500/20 relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-6 h-6 text-pink-400/50" />
                    </div>
                    <h4 className="font-display text-sm font-semibold text-pink-400 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Did You Know?
                    </h4>
                    <p className="text-foreground text-base italic">{result.funFact}</p>
                  </div>

                  {/* Share/Save Actions */}
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => toast.success("Hybrid saved to your collection!")}>
                      Save to Collection
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Share feature coming soon!")}>
                      Share Creation
                    </Button>
                    <Button variant="glow" onClick={handleReset}>
                      Create Another Hybrid
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DNAFusionLab;