import { useState } from "react";
import { Search, Download, Filter, Database, Leaf, Bug, Fish, Trees, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Dataset {
  id: string;
  name: string;
  source: string;
  type: string;
  format: string;
  samples: number;
  description: string;
  icon: any;
}

const datasets: Dataset[] = [
  {
    id: "1",
    name: "Amazon Rainforest eDNA Survey",
    source: "NCBI",
    type: "Plant",
    format: "FASTA",
    samples: 15420,
    description: "Comprehensive plant biodiversity survey from Amazon basin soil and water samples.",
    icon: Trees,
  },
  {
    id: "2",
    name: "Pacific Ocean Marine Life",
    source: "ENA",
    type: "Marine",
    format: "FASTQ",
    samples: 8930,
    description: "Deep-sea organism detection from oceanic water samples across Pacific regions.",
    icon: Fish,
  },
  {
    id: "3",
    name: "European Freshwater Insects",
    source: "iBOL",
    type: "Animal",
    format: "CSV",
    samples: 6750,
    description: "Aquatic insect species identification from European river ecosystems.",
    icon: Bug,
  },
  {
    id: "4",
    name: "Tropical Soil Microbiome",
    source: "GBIF",
    type: "Bacteria",
    format: "FASTA",
    samples: 25000,
    description: "Bacterial community analysis from tropical rainforest soil samples.",
    icon: Microscope,
  },
  {
    id: "5",
    name: "Himalayan Alpine Flora",
    source: "NCBI",
    type: "Plant",
    format: "CSV",
    samples: 4200,
    description: "High-altitude plant species detection from Himalayan mountain ecosystems.",
    icon: Leaf,
  },
  {
    id: "6",
    name: "Coral Reef Biodiversity",
    source: "ENA",
    type: "Marine",
    format: "FASTQ",
    samples: 12800,
    description: "Multi-species eDNA detection from coral reef water samples globally.",
    icon: Fish,
  },
  {
    id: "7",
    name: "Arctic Permafrost Fungi",
    source: "GBIF",
    type: "Fungi",
    format: "FASTA",
    samples: 3500,
    description: "Fungal biodiversity assessment from Arctic permafrost soil cores.",
    icon: Microscope,
  },
  {
    id: "8",
    name: "African Savanna Mammals",
    source: "iBOL",
    type: "Animal",
    format: "CSV",
    samples: 5600,
    description: "Large mammal presence detection from watering hole water samples.",
    icon: Bug,
  },
];

const filterTypes = ["All", "Plant", "Animal", "Marine", "Fungi", "Bacteria"];

const DatasetHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || dataset.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (dataset: Dataset) => {
    // Generate CSV content for all datasets
    const headers = "id,species_name,scientific_name,location,date_collected,confidence,dna_sequence,sample_type";
    const rows = [];
    
    // Generate sample rows based on dataset type
    const sampleSpecies: Record<string, { common: string; scientific: string }[]> = {
      Plant: [
        { common: "Amazon Water Lily", scientific: "Victoria amazonica" },
        { common: "Brazil Nut Tree", scientific: "Bertholletia excelsa" },
        { common: "Kapok Tree", scientific: "Ceiba pentandra" },
      ],
      Animal: [
        { common: "Jaguar", scientific: "Panthera onca" },
        { common: "Capybara", scientific: "Hydrochoerus hydrochaeris" },
        { common: "Harpy Eagle", scientific: "Harpia harpyja" },
      ],
      Marine: [
        { common: "Blue Whale", scientific: "Balaenoptera musculus" },
        { common: "Giant Pacific Octopus", scientific: "Enteroctopus dofleini" },
        { common: "Great White Shark", scientific: "Carcharodon carcharias" },
      ],
      Fungi: [
        { common: "Fly Agaric", scientific: "Amanita muscaria" },
        { common: "Chanterelle", scientific: "Cantharellus cibarius" },
        { common: "Porcini", scientific: "Boletus edulis" },
      ],
      Bacteria: [
        { common: "Soil Bacterium", scientific: "Bacillus subtilis" },
        { common: "Nitrogen Fixer", scientific: "Rhizobium leguminosarum" },
        { common: "Actinobacteria", scientific: "Streptomyces coelicolor" },
      ],
    };

    const species = sampleSpecies[dataset.type] || sampleSpecies.Plant;
    const locations = ["North Region", "South Region", "Central Area", "Eastern Zone", "Western Zone"];
    const sampleTypes = ["Water", "Soil", "Air", "Sediment", "Tissue"];

    for (let i = 1; i <= Math.min(dataset.samples, 100); i++) {
      const sp = species[i % species.length];
      const location = locations[i % locations.length];
      const sampleType = sampleTypes[i % sampleTypes.length];
      const date = new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0];
      const confidence = (0.75 + Math.random() * 0.24).toFixed(2);
      const dnaSequence = Array.from({ length: 20 }, () => "ATCG"[Math.floor(Math.random() * 4)]).join("");
      
      rows.push(`${i.toString().padStart(3, '0')},${sp.common},${sp.scientific},${location},${date},${confidence},${dnaSequence},${sampleType}`);
    }

    const content = `${headers}\n${rows.join('\n')}`;
    const mimeType = "text/csv";

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataset.name.replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${dataset.name}`, {
      description: `Format: CSV | Samples: ${Math.min(dataset.samples, 100)} rows`,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Research Database</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            eDNA <span className="text-primary">Dataset Hub</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access curated environmental DNA datasets from leading biodiversity databases. 
            Filter, search, and download data for your research.
          </p>
        </div>

        {/* What is eDNA? */}
        <div className="glass-card rounded-2xl p-8 mb-12 bio-border animate-slide-up stagger-1">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">
            What is <span className="text-accent">Environmental DNA</span>?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Environmental DNA (eDNA) refers to genetic material obtained directly from environmental 
            samples such as soil, water, or air, without isolating individual organisms. This revolutionary 
            technique allows scientists to detect species presence, assess biodiversity, and monitor 
            ecosystems non-invasively. eDNA analysis has transformed ecological research, enabling rapid 
            detection of rare, elusive, or invasive species.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slide-up stagger-2">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search datasets by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-border/50 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              {filterTypes.map((type) => (
                <Button
                  key={type}
                  variant={activeFilter === type ? "glow" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(type)}
                  className={cn(activeFilter === type && "text-primary-foreground")}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset, index) => {
            const Icon = dataset.icon;
            return (
              <div
                key={dataset.id}
                className="glass-card rounded-2xl p-6 bio-border hover:border-primary/50 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    {dataset.type}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {dataset.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {dataset.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs">
                    {dataset.source}
                  </span>
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs">
                    {dataset.format}
                  </span>
                  <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs">
                    {dataset.samples.toLocaleString()} samples
                  </span>
                </div>

                {/* Download Button */}
                <Button
                  variant="outline"
                  className="w-full group/btn"
                  onClick={() => handleDownload(dataset)}
                >
                  <Download className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                  Download Dataset
                </Button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDatasets.length === 0 && (
          <div className="text-center py-16">
            <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              No Datasets Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetHub;
