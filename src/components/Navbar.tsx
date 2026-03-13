import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Menu, X, Upload, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.services"), href: "/#services" },
    { label: t("nav.howItWorks"), href: "/#workflow" },
    { label: t("nav.insights"), href: "/#insights" },
    { label: t("nav.doctors"), href: "/doctors" },
    { label: t("nav.labs"), href: "/home-sample" },
    { label: t("nav.marketplace"), href: "/marketplace" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-gradient">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Med<span className="text-gradient">Lens</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) =>
            l.href.startsWith("/") && !l.href.startsWith("/#") ? (
              <Link key={l.label} to={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">{t("nav.signIn")}</Button>
          <Link to="/upload">
            <Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
              <Upload className="mr-2 h-4 w-4" /> {t("nav.uploadReport")}
            </Button>
          </Link>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto flex flex-col gap-3 p-4">
            {navLinks.map((l) =>
              l.href.startsWith("/") && !l.href.startsWith("/#") ? (
                <Link key={l.label} to={l.href} className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </a>
              )
            )}
            <LanguageSwitcher />
            <Link to="/upload" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="mt-2 w-full bg-hero-gradient text-primary-foreground">
                <Upload className="mr-2 h-4 w-4" /> {t("nav.uploadReport")}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
