import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Upload, FileText, AlertTriangle, Salad, Activity, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AnalysisResult = {
  summary: string;
  risks: { label: string; severity: string; confidence: number }[];
  diet: {
    veg: { meal: string; items: string }[];
    nonVeg: { meal: string; items: string }[];
  };
};

const UploadReport = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ age: "", gender: "", weight: "", height: "", foodPreference: "" });
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const isValid = form.age && form.gender && form.weight && form.height && form.foodPreference && file;

  const handleAnalyze = async () => {
    if (!isValid) return;
    setAnalyzing(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-report", {
        body: {
          age: parseInt(form.age),
          gender: form.gender,
          weight: parseFloat(form.weight),
          height: parseFloat(form.height),
          foodPreference: form.foodPreference,
          fileName: file!.name,
        },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      const res: AnalysisResult = data;
      setResults(res);

      // Save to DB if logged in
      if (user) {
        const dietKey = form.foodPreference === "veg" ? "veg" : "nonVeg";
        const { error } = await supabase.from("reports").insert({
          user_id: user.id,
          file_name: file!.name,
          age: parseInt(form.age),
          gender: form.gender,
          weight: parseFloat(form.weight),
          height: parseFloat(form.height),
          food_preference: form.foodPreference,
          summary: res.summary,
          risks: res.risks as any,
          diet_plan: res.diet[dietKey] as any,
        });
        if (error) console.error("Failed to save report:", error);
        else toast({ title: "Report saved to your profile!" });
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      toast({ title: "Analysis failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
    if (user) {
      const dietKey = form.foodPreference === "veg" ? "veg" : "nonVeg";
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        file_name: file!.name,
        age: parseInt(form.age),
        gender: form.gender,
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        food_preference: form.foodPreference,
        summary: res.summary,
        risks: res.risks as any,
        diet_plan: res.diet[dietKey] as any,
      });
      if (error) console.error("Failed to save report:", error);
      else toast({ title: "Report saved to your profile!" });
    }
  };

  const dietPlan = results?.diet[form.foodPreference === "veg" ? "veg" : "nonVeg"] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {!user && (
          <div className="mx-auto mb-6 max-w-3xl rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-sm text-foreground">
              <Link to="/auth" className="font-medium text-primary hover:underline">Sign in</Link> to save your reports and track your health history.
            </p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t("upload.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("upload.subtitle")}</p>

          <div className="mt-8 grid gap-6 rounded-xl border border-border bg-card p-6 shadow-card sm:grid-cols-2">
            <div>
              <Label>{t("upload.age")}</Label>
              <Input type="number" placeholder="25" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>{t("upload.gender")}</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder={t("upload.gender")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("upload.male")}</SelectItem>
                  <SelectItem value="female">{t("upload.female")}</SelectItem>
                  <SelectItem value="other">{t("upload.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("upload.weight")}</Label>
              <Input type="number" placeholder="65" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>{t("upload.height")}</Label>
              <Input type="number" placeholder="170" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>{t("upload.foodPreference")}</Label>
              <Select value={form.foodPreference} onValueChange={(v) => setForm({ ...form, foodPreference: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder={t("upload.foodPreference")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">{t("upload.veg")}</SelectItem>
                  <SelectItem value="nonVeg">{t("upload.nonVeg")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              className="sm:col-span-2 cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition-colors hover:border-primary/50"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-primary/60" />
                  <p className="mt-3 text-sm font-medium text-foreground">{t("upload.dragDrop")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t("upload.supportedFormats")}</p>
                </>
              )}
            </div>

            <div className="sm:col-span-2">
              <Button
                size="lg"
                className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
                disabled={!isValid || analyzing}
                onClick={handleAnalyze}
              >
                {analyzing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("upload.analyzing")}</>
                ) : (
                  <><Activity className="mr-2 h-5 w-5" /> {t("upload.analyzeBtn")}</>
                )}
              </Button>
            </div>
          </div>

          {results && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">{t("upload.results")}</h2>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary" /> {t("upload.summary")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{results.summary}</p>
              </div>

              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-destructive" /> {t("upload.risks")}
                </h3>
                <div className="space-y-3">
                  {results.risks.map((r) => (
                    <div key={r.label} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${r.severity === "high" ? "bg-destructive" : r.severity === "moderate" ? "bg-primary" : "bg-secondary"}`} />
                        <span className="text-sm font-medium text-foreground">{r.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full bg-hero-gradient" style={{ width: `${r.confidence}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{r.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <Salad className="h-5 w-5 text-secondary" /> {t("upload.dietPlan")}
                </h3>
                <div className="space-y-3">
                  {dietPlan.map((d) => (
                    <div key={d.meal} className="rounded-lg bg-card p-3 shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{d.meal}</span>
                      <p className="mt-1 text-sm text-muted-foreground">{d.items}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/doctors">
                  <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90">Consult a Specialist</Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline">Shop Recommended Supplements</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadReport;
