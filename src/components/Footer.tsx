import { Dna, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Dna className="w-8 h-8 text-primary" />
              <span className="font-display text-xl font-bold text-foreground tracking-wider">
                eDNA <span className="text-primary">BioVerse</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Exploring biodiversity through environmental DNA analysis and AI-powered species identification. 
              A platform designed for education, research, and discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dataset-hub" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  eDNA Dataset Hub
                </Link>
              </li>
              <li>
                <Link to="/species-identifier" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Species Identifier
                </Link>
              </li>
              <li>
                <Link to="/dna-fusion" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  DNA Fusion Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 eDNA BioVerse.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with 💚 for Biodiversity Research
          </p>
        </div>
      </div>
    </footer>
  );
};
