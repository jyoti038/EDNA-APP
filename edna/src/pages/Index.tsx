import { Database, Search, Gamepad2, Leaf, Microscope, FlaskConical } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";

const Index = () => {
  const features = [
    {
      title: "eDNA Dataset Hub",
      description:
        "Access comprehensive environmental DNA datasets from global biodiversity databases. Filter by organism type, download in multiple formats, and accelerate your research.",
      icon: Database,
      to: "/dataset-hub",
      gradient: "from-primary/30 to-emerald-500/10",
      delay: "stagger-1",
    },
    {
      title: "AI Species Identifier",
      description:
        "Upload images or enter species names to get detailed taxonomic information, habitat data, and conservation status powered by advanced AI analysis.",
      icon: Search,
      to: "/species-identifier",
      gradient: "from-accent/30 to-cyan-500/10",
      delay: "stagger-2",
    },
    {
      title: "DNA Fusion Lab",
      description:
        "Experiment with genetic combinations in our educational DNA fusion game. Merge different species DNA to create unique hybrid organisms and learn about genetics.",
      icon: Gamepad2,
      to: "/dna-fusion",
      gradient: "from-pink-500/20 to-primary/10",
      delay: "stagger-3",
    },
  ];

  const infoCards = [
    {
      icon: Leaf,
      title: "What is eDNA?",
      description:
        "Environmental DNA (eDNA) is genetic material shed by organisms into their environment. It allows researchers to detect species presence without direct observation.",
    },
    {
      icon: Microscope,
      title: "Biodiversity Monitoring",
      description:
        "eDNA technology revolutionizes how we monitor ecosystems, enabling rapid assessment of species diversity in aquatic and terrestrial environments.",
    },
    {
      icon: FlaskConical,
      title: "AI in Biology",
      description:
        "Machine learning algorithms analyze complex genetic sequences, accelerating species identification and enabling new discoveries in biodiversity research.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-wide">
              Discover Our <span className="text-primary">Platform</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three powerful tools designed to make biodiversity research accessible, 
              educational, and engaging for students and researchers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* About eDNA Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-wide">
              Understanding <span className="text-accent">e-DNA Technology</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about the cutting-edge technology powering modern biodiversity research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infoCards.map((card, index) => (
              <div
                key={card.title}
                className="glass-card rounded-2xl p-8 bio-border hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <card.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3 tracking-wide">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Value Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 text-center bio-border relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-wide">
                Academic <span className="text-primary">Excellence</span>
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                This platform demonstrates the integration of modern web technologies with 
                biodiversity science. It showcases practical applications of eDNA technology, 
                AI-powered analysis, and gamification in education—all key areas of contemporary 
                biotechnology and environmental science research.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Biodiversity", "eDNA Technology", "AI/ML", "Gamification", "Web Development"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
