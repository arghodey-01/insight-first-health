import { motion } from "framer-motion";
import { Upload, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t("hero.title1")}
              <span className="text-gradient">{t("hero.titleHighlight")}</span>
              {t("hero.title2")}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{t("hero.description")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/upload">
                <Button size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90 shadow-card-lg">
                  <Upload className="mr-2 h-5 w-5" /> {t("hero.uploadCta")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/doctors">
                <Button size="lg" variant="outline">
                  <Stethoscope className="mr-2 h-5 w-5" /> {t("hero.consultCta")}
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="flex h-2 w-2 rounded-full bg-secondary" />{t("hero.reportsAnalyzed")}</div>
              <div className="flex items-center gap-2"><span className="flex h-2 w-2 rounded-full bg-primary" />{t("hero.verifiedDoctors")}</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <img src={heroIllustration} alt="AI healthcare analytics illustration" className="w-full max-w-lg animate-float" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
