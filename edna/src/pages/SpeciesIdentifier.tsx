import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Upload, Sparkles, Loader2, Camera, X, Dna, Leaf, Bug, MapPin, Heart, Clock, Users, Zap, Globe, AlertTriangle, SwitchCamera } from "lucide-react";
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "search">("upload");

  const stages = [
    "Scanning image patterns...",
    "Analyzing morphological features...",
    "Querying biological databases...",
    "Cross-referencing taxonomy...",
    "Compiling species profile...",
    "Generating comprehensive report..."
  ];

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() && !uploadedImage) {
      toast.error("Please enter a species name or upload an image");
      return;
    }

    // Validate image is not empty
    if (uploadedImage && uploadedImage.length < 100) {
      toast.error("Invalid image. Please try capturing or uploading again.");
      setUploadedImage(null);
      return;
    }

    setIsLoading(true);
    setResult(null);

    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const { data, error } = await supabase.functions.invoke('identify-species', {
        body: { image: uploadedImage || undefined, speciesName: searchQuery.trim() || undefined }
      });
      if (error) { toast.error("Failed to identify species."); return; }
      if (data.error) { toast.error(data.error); return; }
      setResult(data);
      toast.success("Species identified successfully!");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setAnalysisStage("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result && result.length > 100) {
          setUploadedImage(result);
          toast.success("Image uploaded! Click 'Identify Species' to analyze.");
        } else {
          toast.error("Failed to read image. Please try another file.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera must be opened directly from user click handler
  const openCamera = async () => {
    try {
      setCameraReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      // Wait for video element to be rendered, then assign stream
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setCameraReady(true);
        }
      });
    } catch {
      toast.error("Unable to access camera. Please check your browser permissions.");
    }
  };

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
    setCameraReady(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !cameraReady) {
      toast.error("Camera is not ready yet. Please wait a moment.");
      return;
    }
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      if (dataUrl && dataUrl.length > 100) {
        setUploadedImage(dataUrl);
        closeCamera();
        toast.success("Photo captured! Click 'Identify Species' to analyze.");
      } else {
        toast.error("Failed to capture photo. Please try again.");
      }
    }
  }, [closeCamera, cameraReady]);

  const switchCamera = async () => {
    // Stop current stream
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraReady(false);
    
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      toast.error("Unable to switch camera.");
    }
  };

  const clearImage = () => setUploadedImage(null);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("critically endangered")) return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
    if (s.includes("endangered")) return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
    if (s.includes("vulnerable")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    if (s.includes("near threatened")) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    if (s.includes("least concern")) return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  const getKingdomIcon = (kingdom: string) => {
    const k = kingdom?.toLowerCase() || "";
    if (k.includes("animalia")) return <Bug className="w-5 h-5" />;
    if (k.includes("plantae")) return <Leaf className="w-5 h-5" />;
    if (k.includes("fungi")) return <span className="text-lg">🍄</span>;
    return <Dna className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Species Identifier
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Upload a photo, use your camera, or search by name to identify any species and get detailed biological information.
          </p>
        </div>

        {/* Main Card */}
        {!result && !isLoading && (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-8">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: "upload" as const, label: "Upload Image", icon: Upload },
                { id: "camera" as const, label: "Camera", icon: Camera },
                { id: "search" as const, label: "Search by Name", icon: Search },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "camera" && isCameraOpen) closeCamera();
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === "upload" && (
                <div>
                  {uploadedImage ? (
                    <div className="relative">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-56 object-cover rounded-xl border border-border" />
                      <button onClick={clearImage} className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-border hover:scale-105 transition-transform">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary/90 rounded-full text-xs font-medium text-primary-foreground">
                        ✓ Ready for analysis
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-primary/20">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Drop image here or click to browse</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              )}

              {activeTab === "camera" && (
                <div>
                  {isCameraOpen ? (
                    <div className="relative rounded-xl overflow-hidden bg-secondary">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover"
                      />
                      {!cameraReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                        <button onClick={switchCamera} className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                          <SwitchCamera className="w-5 h-5 text-foreground" />
                        </button>
                        <button
                          onClick={capturePhoto}
                          disabled={!cameraReady}
                          className={cn(
                            "w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-lg transition-transform border-4 border-primary",
                            cameraReady ? "hover:scale-105 active:scale-95" : "opacity-50"
                          )}
                        >
                          <div className="w-12 h-12 bg-primary rounded-full" />
                        </button>
                        <button onClick={closeCamera} className="w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                          <X className="w-5 h-5 text-foreground" />
                        </button>
                      </div>
                    </div>
                  ) : uploadedImage ? (
                    <div className="relative">
                      <img src={uploadedImage} alt="Captured" className="w-full h-56 object-cover rounded-xl border border-border" />
                      <button onClick={clearImage} className="absolute top-3 right-3 w-8 h-8 bg-background/90 rounded-full flex items-center justify-center shadow-sm border border-border hover:scale-105 transition-transform">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary/90 rounded-full text-xs font-medium text-primary-foreground">
                        ✓ Ready for analysis
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-56 rounded-xl border-2 border-dashed border-border bg-secondary/30">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 border border-primary/20">
                        <Camera className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Take a photo of any species</p>
                      <p className="text-xs text-muted-foreground mb-3">Point your camera at a plant, animal, or organism</p>
                      <Button onClick={openCamera} variant="default" className="rounded-lg px-5">
                        <Camera className="w-4 h-4 mr-2" />
                        Open Camera
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "search" && (
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., Bengal Tiger, Blue Whale, Oak Tree, Human..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
              )}

              <Button
                onClick={handleSearch}
                disabled={isLoading || (!searchQuery.trim() && !uploadedImage)}
                className="w-full mt-5 h-12 rounded-xl font-medium text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{analysisStage}</span>
                  </div>
                ) : (
                  <>
                    <Dna className="w-4 h-4 mr-2" />
                    Identify Species
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-border bg-card shadow-sm p-10 text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Dna className="w-8 h-8 text-primary" />
              </div>
            </div>
            <p className="text-base font-semibold text-foreground mb-1">Analyzing Species</p>
            <p className="text-sm text-primary animate-pulse">{analysisStage}</p>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  {getKingdomIcon(result.taxonomy?.kingdom)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-foreground">{result.commonName}</h2>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", getStatusColor(result.conservationStatus))}>
                      {result.conservationStatus}
                    </span>
                  </div>
                  <p className="text-primary italic text-sm mb-1">{result.scientificName}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.taxonomy?.kingdom} · {result.taxonomy?.phylum} · {result.taxonomy?.class}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Dna className="w-4 h-4 text-primary" />
                Classification
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.taxonomy && Object.entries(result.taxonomy).map(([rank, name]) => (
                  <div key={rank} className="px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">{rank}</span>
                    <span className="text-xs font-medium text-foreground">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard icon={<MapPin />} title="Habitat" content={result.habitat} />
              <InfoCard icon={<Heart />} title="Diet / Nutrition" content={result.diet} />
              <InfoCard icon={<Zap />} title="Behavior" content={result.behavior} />
              {result.physicalCharacteristics && <InfoCard icon={<Users />} title="Physical Characteristics" content={result.physicalCharacteristics} />}
              {result.reproduction && <InfoCard icon={<Clock />} title="Reproduction" content={result.reproduction} />}
              {result.evolution && <InfoCard icon={<Globe />} title="Evolution" content={result.evolution} />}
              {result.ecologicalRole && <InfoCard icon={<Leaf />} title="Ecological Role" content={result.ecologicalRole} />}
              {result.threats && <InfoCard icon={<AlertTriangle />} title="Threats" content={result.threats} />}
              {result.humanInteraction && <InfoCard icon={<Users />} title="Human Interaction" content={result.humanInteraction} />}
            </div>

            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
              <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Did You Know?
              </h4>
              <p className="text-sm text-foreground leading-relaxed">{result.funFact}</p>
            </div>

            <div className="text-center pt-2">
              <Button
                onClick={() => { setResult(null); setUploadedImage(null); setSearchQuery(""); setActiveTab("upload"); }}
                variant="outline"
                className="rounded-xl px-6"
              >
                <Search className="w-4 h-4 mr-2" />
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
  <div className="rounded-xl border border-border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-primary">{icon}</span>
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
  </div>
);

export default SpeciesIdentifier;
