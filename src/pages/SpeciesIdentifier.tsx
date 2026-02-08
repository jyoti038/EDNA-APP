import { useState } from "react";
import { Search, Upload, Sparkles, Loader2, Image as ImageIcon, X, Dna, Leaf, Bug, MapPin, Heart, Clock, Shield, Users, Zap, Globe, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SpeciesResult {
  commonName: string;
  scientificName: string;
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  habitat: string;
  diet: string;
  behavior: string;
  conservationStatus: string;
  evolution?: string;
  physicalCharacteristics?: string;
  reproduction?: string;
  ecologicalRole?: string;
  funFact: string;
  threats?: string;
  humanInteraction?: string;
}

const SpeciesIdentifier = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SpeciesResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState("");

  const stages = [
    "Scanning image patterns...",
    "Analyzing morphological features...",
    "Querying biological databases...",
    "Cross-referencing taxonomy...",
    "Compiling species profile...",
    "Generating comprehensive report..."
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim() && !uploadedImage) {
      toast.error("Please enter a species name or upload an image");
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Animate through stages
    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const { data, error } = await supabase.functions.invoke('identify-species', {
        body: {
          image: uploadedImage,
          speciesName: searchQuery.trim() || undefined
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to identify species. Please try again.");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult(data);
      toast.success("Species identified successfully!");
    } catch (error) {
      console.error("Error identifying species:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setAnalysisStage("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        toast.success("Image uploaded! Click 'Identify Species' to analyze.");
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase() || "";
    if (lowerStatus.includes("critically endangered")) return "bg-red-600/20 text-red-400 border-red-600/30";
    if (lowerStatus.includes("endangered")) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (lowerStatus.includes("vulnerable")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    if (lowerStatus.includes("near threatened")) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (lowerStatus.includes("least concern")) return "bg-green-500/20 text-green-400 border-green-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  const getKingdomIcon = (kingdom: string) => {
    const k = kingdom?.toLowerCase() || "";
    if (k.includes("animalia")) return <Bug className="w-5 h-5" />;
    if (k.includes("plantae")) return <Leaf className="w-5 h-5" />;
    if (k.includes("fungi")) return <span className="text-lg">🍄</span>;
    if (k.includes("bacteria") || k.includes("archaea")) return <span className="text-lg">🦠</span>;
    return <Dna className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm text-accent font-medium">AI-Powered Identification</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Species <span className="text-accent">Identifier</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload an image of any plant, animal, fungi, or organism to get detailed taxonomic 
            information, habitat data, evolution history, and conservation status powered by advanced AI.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass-card rounded-2xl p-8 bio-border animate-slide-up stagger-1">
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-accent" />
                Upload Image for AI Analysis
              </label>
              {uploadedImage ? (
                <div className="relative inline-block group">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-accent/30 shadow-lg shadow-accent/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <X className="w-5 h-5 text-destructive-foreground" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-accent/90 rounded-full text-xs font-medium text-accent-foreground">
                    Ready for analysis
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 bg-card/50 group">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-8 h-8 text-accent" />
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">
                      Drop your image here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (max 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-accent" />
                Search by Species Name
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="e.g., Bengal Tiger, Blue Whale, Oak Tree, Human..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-14 bg-card border-border/50 focus:border-accent text-lg"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              variant="bio"
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{analysisStage}</span>
                </div>
              ) : (
                <>
                  <Dna className="w-6 h-6" />
                  Identify Species
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-8 bio-border">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-ping" />
                  <div className="absolute inset-2 border-4 border-primary/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute inset-4 border-4 border-accent/40 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Dna className="w-12 h-12 text-accent animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground mb-2">Analyzing Species</p>
                <p className="text-sm text-accent animate-pulse">{analysisStage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && !isLoading && (
          <div className="max-w-5xl mx-auto animate-scale-in">
            <div className="glass-card rounded-2xl overflow-hidden bio-border">
              {/* Header */}
              <div className="relative p-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-accent/30 rounded-full animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative flex flex-col md:flex-row items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30">
                    {getKingdomIcon(result.taxonomy?.kingdom)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                        {result.commonName}
                      </h2>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getStatusColor(result.conservationStatus))}>
                        {result.conservationStatus}
                      </span>
                    </div>
                    <p className="text-accent italic text-xl mb-3">{result.scientificName}</p>
                    <p className="text-muted-foreground text-sm">
                      Kingdom: {result.taxonomy?.kingdom} • Class: {result.taxonomy?.class}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Taxonomy */}
                <div className="mb-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Dna className="w-5 h-5 text-accent" />
                    Taxonomic Classification
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.taxonomy && Object.entries(result.taxonomy).map(([rank, name], index, arr) => (
                      <div key={rank} className="flex items-center gap-2">
                        <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:border-accent/50 transition-colors">
                          <span className="text-xs text-muted-foreground capitalize block mb-1">
                            {rank}
                          </span>
                          <span className="text-sm text-foreground font-medium">{name}</span>
                        </div>
                        {index < arr.length - 1 && (
                          <span className="text-accent text-xl">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <InfoCard icon={<MapPin />} title="Habitat" content={result.habitat} />
                  <InfoCard icon={<Heart />} title="Diet / Nutrition" content={result.diet} />
                  <InfoCard icon={<Zap />} title="Behavior" content={result.behavior} />
                  {result.physicalCharacteristics && (
                    <InfoCard icon={<Users />} title="Physical Characteristics" content={result.physicalCharacteristics} />
                  )}
                  {result.reproduction && (
                    <InfoCard icon={<Clock />} title="Reproduction" content={result.reproduction} />
                  )}
                  {result.evolution && (
                    <InfoCard icon={<Globe />} title="Evolution" content={result.evolution} />
                  )}
                  {result.ecologicalRole && (
                    <InfoCard icon={<Leaf />} title="Ecological Role" content={result.ecologicalRole} />
                  )}
                  {result.threats && (
                    <InfoCard icon={<AlertTriangle />} title="Threats" content={result.threats} />
                  )}
                  {result.humanInteraction && (
                    <InfoCard icon={<Users />} title="Human Interaction" content={result.humanInteraction} />
                  )}
                </div>

                {/* Fun Fact */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
                  <h4 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Did You Know?
                  </h4>
                  <p className="text-foreground">{result.funFact}</p>
                </div>
              </div>
            </div>

            {/* New Search Button */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setResult(null);
                  setUploadedImage(null);
                  setSearchQuery("");
                }}
                className="border-accent/30 hover:border-accent hover:bg-accent/10"
              >
                <Search className="w-5 h-5 mr-2" />
                Identify Another Species
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <div className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border/50 hover:border-accent/30">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-accent">{icon}</span>
      <h4 className="font-display text-sm font-semibold text-accent">{title}</h4>
    </div>
    <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
  </div>
);

export default SpeciesIdentifier;
