import { useState } from "react";
import { Dna, Sparkles, Loader2, RefreshCw, Zap, Atom, FlaskConical, Brain, Heart, Shield, Wind, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
        intelligence: 85, strength: 92, agility: 88, defense: 78,
      },
      description: "A majestic fusion of the king of beasts and the master of skies.",
      funFact: "The Gryphon Rex can spot prey from 3 miles away while soaring!",
    },
    "shark-octopus": {
      name: "Krakenshark",
      type: "Deep Sea Predator",
      rarity: "Legendary",
      characteristics: {
        size: "Massive (8m length, 500kg)",
        habitat: "Deep ocean trenches and coral reefs",
        specialAbility: "Eight tentacles with razor-sharp teeth",
        diet: "Apex predator - consumes anything",
        lifespan: "300+ years",
        intelligence: 95, strength: 98, agility: 75, defense: 85,
      },
      description: "The ultimate marine predator combining shark and octopus.",
      funFact: "Can change color while attacking and has three hearts!",
    },
    "butterfly-firefly": {
      name: "Lumina Papillon",
      type: "Bioluminescent Insect",
      rarity: "Epic",
      characteristics: {
        size: "Small (15cm wingspan)",
        habitat: "Enchanted forests and twilight meadows",
        specialAbility: "Creates mesmerizing light patterns",
        diet: "Nectar and starlight energy",
        lifespan: "2-3 years",
        intelligence: 45, strength: 15, agility: 95, defense: 30,
      },
      description: "An ethereal creature combining butterfly beauty with firefly glow.",
      funFact: "Their light show can hypnotize predators from over 2km away!",
    },
    "tree-mushroom": {
      name: "Mycowood Titan",
      type: "Symbiotic Megaflora",
      rarity: "Epic",
      characteristics: {
        size: "Colossal (30m height)",
        habitat: "Ancient forests and underground caverns",
        specialAbility: "Creates vast underground nutrient networks",
        diet: "Photosynthesis and decomposition",
        lifespan: "1000+ years",
        intelligence: 70, strength: 65, agility: 5, defense: 99,
      },
      description: "A revolutionary life form merging oak tree structure with fungal networks.",
      funFact: "Can communicate with thousands of plants through its fungal network!",
    },
    "wolf-dragon": {
      name: "Fenrir Draconis",
      type: "Mythical Apex Predator",
      rarity: "Legendary",
      characteristics: {
        size: "Enormous (5m height, 1000kg)",
        habitat: "Volcanic mountains and frozen tundras",
        specialAbility: "Breathes elemental fire and ice",
        diet: "Carnivore - legendary beasts",
        lifespan: "Immortal",
        intelligence: 98, strength: 99, agility: 90, defense: 95,
      },
      description: "The ultimate fusion of canine pack loyalty and draconic power.",
      funFact: "Legends say Fenrir Draconis can speak all languages!",
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
      specialAbility: "Combines traits from both parent species",
      diet: "Omnivore - highly adaptable",
      lifespan: "Unknown - still being studied",
      intelligence: Math.floor(Math.random() * 40) + 50,
      strength: Math.floor(Math.random() * 40) + 50,
      agility: Math.floor(Math.random() * 40) + 50,
      defense: Math.floor(Math.random() * 40) + 50,
    },
    description: baseHybrid?.description || `A unique fusion combining the genetic traits of ${dnaA} and ${dnaB}.`,
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

const DNAStrand = ({ sequence, isAnimating }: { sequence: string; isAnimating: boolean }) => (
  <div className="flex flex-wrap justify-center gap-0.5 p-4 bg-secondary/50 rounded-lg font-mono text-xs">
    {sequence.split("").map((base, i) => (
      <span
        key={i}
        className={cn(
          "w-5 h-5 flex items-center justify-center rounded transition-all duration-300",
          base === "A" && "bg-red-500/20 text-red-500",
          base === "T" && "bg-blue-500/20 text-blue-500",
          base === "C" && "bg-green-500/20 text-green-500",
          base === "G" && "bg-yellow-500/20 text-yellow-500",
          isAnimating && "animate-pulse"
        )}
        style={{ animationDelay: `${i * 30}ms` }}
      >
        {base}
      </span>
    ))}
  </div>
);

const RarityBadge = ({ rarity }: { rarity: string }) => {
  const colors = {
    Common: "bg-muted text-muted-foreground border-border",
    Rare: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    Epic: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    Legendary: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse",
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
  const [fusionImage, setFusionImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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
    setFusionImage(null);

    for (let i = 0; i <= 100; i += 12.5) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setProgress(Math.min(i, 100));
      setFusionStage(fusionStages[Math.floor(i / 12.5)] || fusionStages[0]);
    }

    const hybrid = generateHybrid(finalDnaA, finalDnaB);
    setResult(hybrid);
    setIsLoading(false);
    toast.success("DNA Fusion Complete!", {
      description: `Created: ${hybrid.name} (${hybrid.rarity})`,
    });

    // Auto-generate fusion image
    generateFusionImage(finalDnaA, finalDnaB, hybrid);
  };

  const generateFusionImage = async (speciesA: string, speciesB: string, hybrid: HybridResult) => {
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-fusion-image', {
        body: {
          speciesA,
          speciesB,
          hybridName: hybrid.name,
          hybridDescription: hybrid.description,
        }
      });

      if (error) {
        console.error("Fusion image error:", error);
        toast.error("Could not generate fusion image");
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (data?.imageUrl) {
        setFusionImage(data.imageUrl);
        toast.success("Fusion image generated!");
      }
    } catch (err) {
      console.error("Error generating fusion image:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleReset = () => {
    setDnaA("");
    setDnaB("");
    setCustomDnaA("");
    setCustomDnaB("");
    setResult(null);
    setProgress(0);
    setFusionStage("");
    setFusionImage(null);
  };

  const selectedDnaA = dnaOptions.find(o => o.id === dnaA);
  const selectedDnaB = dnaOptions.find(o => o.id === dnaB);

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Genetic Laboratory</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            DNA Fusion Lab
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Select two organisms and witness the creation of never-before-seen hybrid species
            with AI-generated visualizations.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* DNA Selection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* DNA A */}
            <div className="glass-card rounded-2xl p-6 bio-border animate-slide-up stagger-1">
              <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Dna className="w-5 h-5 text-primary" />
                </div>
                DNA Sample A
                {selectedDnaA && <span className="ml-auto text-2xl">{selectedDnaA.emoji}</span>}
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dnaOptions.slice(0, 6).map((option) => (
                  <button
                    key={option.id}
                    onClick={() => { setDnaA(option.id); setCustomDnaA(""); }}
                    className={cn(
                      "group relative p-4 rounded-xl text-center transition-all duration-300 overflow-hidden",
                      dnaA === option.id
                        ? "ring-2 ring-primary shadow-lg shadow-primary/20 scale-105 bg-primary/10"
                        : "bg-secondary/50 hover:bg-secondary hover:scale-102"
                    )}
                  >
                    <div className="relative">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.emoji}</div>
                      <div className="text-sm font-medium text-foreground">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.type}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or type a custom species..."
                value={customDnaA}
                onChange={(e) => { setCustomDnaA(e.target.value); setDnaA(""); }}
                className="bg-background/50 border-border/50 h-12"
              />
            </div>

            {/* DNA B */}
            <div className="glass-card rounded-2xl p-6 bio-border animate-slide-up stagger-2">
              <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Atom className="w-5 h-5 text-accent" />
                </div>
                DNA Sample B
                {selectedDnaB && <span className="ml-auto text-2xl">{selectedDnaB.emoji}</span>}
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dnaOptions.slice(6).map((option) => (
                  <button
                    key={option.id}
                    onClick={() => { setDnaB(option.id); setCustomDnaB(""); }}
                    className={cn(
                      "group relative p-4 rounded-xl text-center transition-all duration-300 overflow-hidden",
                      dnaB === option.id
                        ? "ring-2 ring-accent shadow-lg shadow-accent/20 scale-105 bg-accent/10"
                        : "bg-secondary/50 hover:bg-secondary hover:scale-102"
                    )}
                  >
                    <div className="relative">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.emoji}</div>
                      <div className="text-sm font-medium text-foreground">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.type}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or type a custom species..."
                value={customDnaB}
                onChange={(e) => { setCustomDnaB(e.target.value); setDnaB(""); }}
                className="bg-background/50 border-border/50 h-12"
              />
            </div>
          </div>

          {/* Fusion Controls */}
          <div className="flex flex-col items-center gap-6 mb-12 animate-slide-up stagger-3">
            {isLoading && (
              <div className="w-full max-w-lg glass-card rounded-2xl p-6 bio-border">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-primary font-medium animate-pulse">{fusionStage}</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-6 flex justify-center">
                  <Dna className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="bio"
                size="xl"
                onClick={handleMerge}
                disabled={isLoading}
                className="relative overflow-hidden group px-8 py-6 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Fusing DNA...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Initiate Fusion</span>
                    <Zap className="w-5 h-5" />
                  </div>
                )}
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
              <div className="glass-card rounded-3xl overflow-hidden bio-border">
                {/* Header */}
                <div className="relative p-8 md:p-12 bg-primary/5">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <RarityBadge rarity={result.rarity} />
                      <span className="px-3 py-1 rounded-full bg-secondary border border-border text-sm text-muted-foreground">
                        {result.type}
                      </span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
                      {result.name}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {result.description}
                    </p>
                  </div>
                </div>

                {/* AI Generated Image */}
                <div className="px-8 md:px-12 pt-8">
                  <div className="rounded-2xl overflow-hidden border border-border bg-secondary/30">
                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-foreground">Generating AI visualization...</p>
                        <p className="text-xs text-muted-foreground">Creating what {result.name} might look like</p>
                      </div>
                    ) : fusionImage ? (
                      <div className="relative">
                        <img
                          src={fusionImage}
                          alt={`AI visualization of ${result.name}`}
                          className="w-full h-auto max-h-96 object-contain bg-secondary/20"
                        />
                        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-muted-foreground border border-border">
                          AI Generated Visualization
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Image generation unavailable</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const finalA = dnaA || customDnaA;
                            const finalB = dnaB || customDnaB;
                            generateFusionImage(finalA, finalB, result);
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Retry Generation
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 space-y-8">
                  {/* DNA Sequence */}
                  <div>
                    <h4 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Dna className="w-4 h-4" />
                      Hybrid DNA Sequence
                    </h4>
                    <DNAStrand sequence={result.dnaSequence} isAnimating={false} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatBar label="Intelligence" value={result.characteristics.intelligence} icon={Brain} color="text-blue-500" />
                    <StatBar label="Strength" value={result.characteristics.strength} icon={Zap} color="text-red-500" />
                    <StatBar label="Agility" value={result.characteristics.agility} icon={Wind} color="text-green-500" />
                    <StatBar label="Defense" value={result.characteristics.defense} icon={Shield} color="text-amber-500" />
                  </div>

                  {/* Characteristics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Size", value: result.characteristics.size },
                      { label: "Habitat", value: result.characteristics.habitat },
                      { label: "Diet", value: result.characteristics.diet },
                      { label: "Lifespan", value: result.characteristics.lifespan },
                      { label: "Special Ability", value: result.characteristics.specialAbility },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors">
                        <h4 className="font-display text-xs font-semibold mb-2 uppercase tracking-wider text-primary">
                          {item.label}
                        </h4>
                        <p className="text-foreground text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Fun Fact */}
                  <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20">
                    <h4 className="font-display text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Did You Know?
                    </h4>
                    <p className="text-foreground text-base italic">{result.funFact}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => toast.success("Hybrid saved to your collection!")}>
                      Save to Collection
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Share feature coming soon!")}>
                      Share Creation
                    </Button>
                    <Button variant="default" onClick={handleReset}>
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
