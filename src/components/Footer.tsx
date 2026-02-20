import { Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Med<span className="text-gradient">Lens</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              AI-powered blood report analysis for smarter health decisions.
            </p>
          </div>

          {[
            { title: "Platform", links: ["Blood Analyzer", "AI Insights", "Consultations", "Lab Finder"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Data Security", "Compliance"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MedLens. All rights reserved. Not a substitute for professional medical advice.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
