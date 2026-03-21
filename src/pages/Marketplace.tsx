import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, X, Pill, Salad, Dumbbell, Heart, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Product = { id: number; name: string; category: string; price: number; image: string; description: string; recommended?: boolean; matchReason?: string };

const baseProducts: Product[] = [
  { id: 1, name: "Vitamin D3 2000 IU", category: "supplements", price: 349, image: "💊", description: "Daily vitamin D supplement for bone health" },
  { id: 2, name: "Omega-3 Fish Oil", category: "supplements", price: 599, image: "🐟", description: "Heart-healthy omega-3 fatty acids, 1000mg" },
  { id: 3, name: "Iron + Folic Acid", category: "supplements", price: 199, image: "💉", description: "For hemoglobin improvement and anemia prevention" },
  { id: 4, name: "Calcium + Magnesium", category: "supplements", price: 449, image: "🦴", description: "Bone strength and muscle function support" },
  { id: 5, name: "Metformin 500mg", category: "medicines", price: 89, image: "💊", description: "Blood sugar control (prescription required)" },
  { id: 6, name: "Atorvastatin 10mg", category: "medicines", price: 120, image: "💊", description: "Cholesterol management (prescription required)" },
  { id: 7, name: "B-Complex Forte", category: "medicines", price: 149, image: "💊", description: "Complete B-vitamin complex for energy" },
  { id: 8, name: "Quinoa (500g)", category: "diet", price: 299, image: "🌾", description: "High-protein grain for balanced meals" },
  { id: 9, name: "Flaxseed Powder (250g)", category: "diet", price: 179, image: "🌱", description: "Rich in omega-3 and fiber" },
  { id: 10, name: "Ragi Flour (1kg)", category: "diet", price: 129, image: "🌾", description: "Iron-rich millet flour for anemia management" },
  { id: 11, name: "Mixed Nuts Pack (500g)", category: "diet", price: 549, image: "🥜", description: "Almonds, walnuts, cashews for heart health" },
  { id: 12, name: "Glucometer Kit", category: "devices", price: 1299, image: "🩸", description: "Blood sugar monitoring at home" },
  { id: 13, name: "BP Monitor Digital", category: "devices", price: 1899, image: "💓", description: "Automatic digital blood pressure monitor" },
  { id: 14, name: "Pulse Oximeter", category: "devices", price: 799, image: "🫁", description: "SpO2 and pulse rate monitoring" },
  { id: 15, name: "Vitamin B12 1500mcg", category: "supplements", price: 279, image: "💊", description: "Supports nerve health and energy levels" },
  { id: 16, name: "Zinc + Vitamin C", category: "supplements", price: 199, image: "🛡️", description: "Immunity booster and antioxidant support" },
  { id: 17, name: "Multivitamin Daily", category: "supplements", price: 399, image: "💊", description: "Complete daily nutrition supplement" },
  { id: 18, name: "Oats Steel Cut (1kg)", category: "diet", price: 189, image: "🥣", description: "Heart-healthy whole grain for cholesterol control" },
  { id: 19, name: "Chia Seeds (250g)", category: "diet", price: 229, image: "🌱", description: "Rich in fiber, omega-3, and calcium" },
  { id: 20, name: "Spirulina Powder (100g)", category: "diet", price: 349, image: "🌿", description: "Superfood rich in iron and protein" },
];

// Mapping of health risk keywords to recommended product IDs
const riskProductMap: Record<string, number[]> = {
  anemia: [3, 10, 20, 15],
  iron: [3, 10, 20],
  hemoglobin: [3, 10, 20],
  cholesterol: [2, 6, 9, 11, 18],
  lipid: [2, 6, 9, 18],
  sugar: [5, 12, 8, 18],
  diabetes: [5, 12, 8, 18],
  glucose: [5, 12, 8],
  vitamin: [1, 15, 16, 17],
  "vitamin d": [1],
  "vitamin b12": [15],
  "b12": [15],
  calcium: [4, 19],
  bone: [1, 4],
  heart: [2, 11, 13, 18],
  cardiac: [2, 13],
  "blood pressure": [13],
  hypertension: [13],
  thyroid: [17],
  immunity: [16, 17],
  oxygen: [14],
  spo2: [14],
  liver: [7, 17],
  kidney: [17],
  protein: [8, 20],
};

const categories = [
  { key: "all", label: "All", icon: Heart },
  { key: "recommended", label: "aiRecommended", icon: Sparkles },
  { key: "supplements", label: "supplements", icon: Pill },
  { key: "medicines", label: "medicines", icon: Pill },
  { key: "diet", label: "dietItems", icon: Salad },
  { key: "devices", label: "healthDevices", icon: Dumbbell },
];

type CartItem = Product & { qty: number };

const Marketplace = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [loading, setLoading] = useState(false);
  const [hasReport, setHasReport] = useState(false);

  // Fetch latest report and match recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setProducts(baseProducts);
        setHasReport(false);
        return;
      }

      setLoading(true);
      try {
        const { data: reports } = await supabase
          .from("reports")
          .select("risks, diet_plan, summary")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!reports || reports.length === 0) {
          setProducts(baseProducts);
          setHasReport(false);
          setLoading(false);
          return;
        }

        setHasReport(true);
        const report = reports[0];
        const recommendedIds = new Set<number>();
        const matchReasons = new Map<number, string>();

        // Match from risks
        const risks = report.risks as Array<{ label: string; severity: string }> | null;
        if (risks && Array.isArray(risks)) {
          for (const risk of risks) {
            const label = risk.label.toLowerCase();
            for (const [keyword, productIds] of Object.entries(riskProductMap)) {
              if (label.includes(keyword)) {
                for (const pid of productIds) {
                  recommendedIds.add(pid);
                  matchReasons.set(pid, `Based on: ${risk.label}`);
                }
              }
            }
          }
        }

        // Match from summary
        const summary = (report.summary || "").toLowerCase();
        for (const [keyword, productIds] of Object.entries(riskProductMap)) {
          if (summary.includes(keyword)) {
            for (const pid of productIds) {
              recommendedIds.add(pid);
              if (!matchReasons.has(pid)) {
                matchReasons.set(pid, "Based on your report analysis");
              }
            }
          }
        }

        // If no matches found from keywords, recommend general health products
        if (recommendedIds.size === 0) {
          [17, 16, 2, 11].forEach(id => {
            recommendedIds.add(id);
            matchReasons.set(id, "General health recommendation");
          });
        }

        const enriched = baseProducts.map((p) => ({
          ...p,
          recommended: recommendedIds.has(p.id),
          matchReason: matchReasons.get(p.id),
        }));

        // Sort: recommended first
        enriched.sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
        setProducts(enriched);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setProducts(baseProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || (category === "recommended" ? p.recommended : p.category === category);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === p.id);
      if (existing) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...p, qty: 1 }];
    });
    toast({ title: `${p.name} added to cart` });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c)).filter((c) => c.qty > 0));
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const recommendedCount = products.filter((p) => p.recommended).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t("marketplace.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("marketplace.subtitle")}</p>
          </div>
          <Button variant="outline" className="relative shrink-0" onClick={() => setShowCart(!showCart)}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* AI Recommendations Banner */}
        {hasReport && recommendedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-secondary/30 bg-secondary/5 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {recommendedCount} products recommended based on your report
                </h3>
                <p className="text-sm text-muted-foreground">
                  Personalized suggestions from your latest blood report analysis
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto shrink-0 border-secondary/30 text-secondary hover:bg-secondary/10"
                onClick={() => setCategory("recommended")}
              >
                View All
              </Button>
            </div>
          </motion.div>
        )}

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                <Link to="/auth" className="font-medium text-primary hover:underline">Sign in</Link> and{" "}
                <Link to="/upload" className="font-medium text-primary hover:underline">upload a report</Link>{" "}
                to get AI-personalized product recommendations.
              </p>
            </div>
          </motion.div>
        )}

        {/* Search + Categories */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("marketplace.search")} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <Button
                key={c.key}
                size="sm"
                variant={category === c.key ? "default" : "outline"}
                className={category === c.key ? "bg-hero-gradient text-primary-foreground" : ""}
                onClick={() => setCategory(c.key)}
              >
                {c.key === "all" ? "All" : c.key === "recommended" ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI Picks
                  </span>
                ) : t(`marketplace.${c.label}`)}
              </Button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading personalized recommendations...</span>
          </div>
        )}

        <div className="mt-8 flex gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover ${
                    p.recommended ? "border-secondary/40 ring-1 ring-secondary/20" : "border-border"
                  }`}
                >
                  {p.recommended && (
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-secondary/10 text-secondary text-[10px] flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> AI Recommended
                      </Badge>
                    </div>
                  )}
                  <div className="text-4xl">{p.image}</div>
                  <h3 className="mt-3 font-semibold text-card-foreground">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  {p.matchReason && (
                    <p className="mt-1 text-[10px] font-medium text-secondary">{p.matchReason}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">₹{p.price}</span>
                    <Button size="sm" onClick={() => addToCart(p)} className="bg-hero-gradient text-primary-foreground text-xs hover:opacity-90">
                      {t("marketplace.addToCart")}
                    </Button>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && !loading && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No products found. Try a different search or category.
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar (desktop) */}
          {showCart && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden w-80 shrink-0 rounded-xl border border-border bg-card p-5 shadow-card-lg lg:block"
              style={{ position: "sticky", top: "5rem", maxHeight: "calc(100vh - 6rem)", overflowY: "auto" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{t("marketplace.cart")}</h3>
                <button onClick={() => setShowCart(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("marketplace.empty")}</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                        <span className="text-2xl">{c.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground">₹{c.price}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(c.id, -1)} className="rounded bg-background p-1"><Minus className="h-3 w-3" /></button>
                          <span className="w-6 text-center text-xs font-medium">{c.qty}</span>
                          <button onClick={() => updateQty(c.id, 1)} className="rounded bg-background p-1"><Plus className="h-3 w-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex justify-between text-sm font-semibold text-foreground">
                      <span>{t("marketplace.total")}</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <Button className="mt-3 w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
                      {t("marketplace.checkout")}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
