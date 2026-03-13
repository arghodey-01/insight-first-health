import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MapPin, Clock, IndianRupee, ArrowLeft, CheckCircle2, FlaskConical, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const labs = [
  { id: 1, name: "HealthScan Diagnostics", distance: "1.2 km", rating: 4.8, homeCollection: true, turnaround: "6 hrs" },
  { id: 2, name: "CityLab Pathology", distance: "2.8 km", rating: 4.6, homeCollection: true, turnaround: "12 hrs" },
  { id: 3, name: "MedTest Center", distance: "3.5 km", rating: 4.5, homeCollection: true, turnaround: "24 hrs" },
  { id: 4, name: "Apollo Diagnostics", distance: "4.1 km", rating: 4.9, homeCollection: true, turnaround: "8 hrs" },
];

const testPackages = [
  { id: 1, name: "Complete Blood Count (CBC)", price: 299 },
  { id: 2, name: "Lipid Profile", price: 499 },
  { id: 3, name: "Thyroid Panel (T3, T4, TSH)", price: 699 },
  { id: 4, name: "Liver Function Test (LFT)", price: 549 },
  { id: 5, name: "Kidney Function Test (KFT)", price: 599 },
  { id: 6, name: "Vitamin D Test", price: 399 },
  { id: 7, name: "HbA1c (Diabetes)", price: 449 },
  { id: 8, name: "Full Body Checkup", price: 1999 },
];

const timeSlots = ["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

type Step = "lab" | "tests" | "schedule" | "confirmed";

const HomeSampleCollection = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("lab");
  const [selectedLab, setSelectedLab] = useState<typeof labs[0] | null>(null);
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [address, setAddress] = useState("");

  const toggleTest = (id: number) => {
    setSelectedTests((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const totalPrice = testPackages.filter((t) => selectedTests.includes(t.id)).reduce((s, t) => s + t.price, 0);

  const handleSchedule = () => {
    if (!address || !selectedSlot) {
      toast({ title: "Please fill address and select time", variant: "destructive" });
      return;
    }
    setStep("confirmed");
    toast({ title: "Collection scheduled successfully!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6">
          {step !== "lab" ? (
            <button onClick={() => setStep(step === "confirmed" ? "lab" : step === "schedule" ? "tests" : "lab")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t("homeSample.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("homeSample.subtitle")}</p>

        {/* Steps indicator */}
        <div className="mt-8 flex items-center gap-2 text-xs">
          {["Select Lab", "Select Tests", "Schedule", "Confirmed"].map((s, i) => {
            const stepKeys: Step[] = ["lab", "tests", "schedule", "confirmed"];
            const isActive = stepKeys.indexOf(step) >= i;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${isActive ? "bg-hero-gradient text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </span>
                <span className={`hidden sm:inline ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < 3 && <div className={`h-px w-6 ${isActive ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === "lab" && (
            <motion.div key="lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 grid gap-4 sm:grid-cols-2">
              {labs.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
                  onClick={() => { setSelectedLab(lab); setStep("tests"); }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{lab.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {lab.distance}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lab.turnaround}</span>
                        <span className="flex items-center gap-1 text-secondary font-medium"><Home className="h-3 w-3" /> Home Collection</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">⭐ {lab.rating}</span>
                  </div>
                  <Button size="sm" className="mt-4 bg-hero-gradient text-primary-foreground hover:opacity-90">Select Lab</Button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {step === "tests" && (
            <motion.div key="tests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-8 max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <FlaskConical className="h-5 w-5 text-primary" /> {t("homeSample.selectTest")}
                </h3>
                <div className="space-y-3">
                  {testPackages.map((test) => (
                    <label
                      key={test.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${selectedTests.includes(test.id) ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedTests.includes(test.id)} onCheckedChange={() => toggleTest(test.id)} />
                        <span className="text-sm font-medium text-foreground">{test.name}</span>
                      </div>
                      <span className="text-sm font-bold text-foreground flex items-center"><IndianRupee className="h-3 w-3" />{test.price}</span>
                    </label>
                  ))}
                </div>
                {selectedTests.length > 0 && (
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-semibold text-foreground">Total: ₹{totalPrice}</span>
                    <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={() => setStep("schedule")}>
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === "schedule" && (
            <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-8 max-w-lg">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
                <div>
                  <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" /> Pick Time — Tomorrow
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <Button key={slot} variant="outline" size="sm" className={`text-xs ${selectedSlot === slot ? "border-primary bg-primary/10 text-primary" : ""}`} onClick={() => setSelectedSlot(slot)}>
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{t("homeSample.address")}</Label>
                  <Input className="mt-1" placeholder="Enter your full address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Lab</span><span className="font-medium text-foreground">{selectedLab?.name}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Tests</span><span className="font-medium text-foreground">{selectedTests.length} selected</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Total</span><span className="font-bold text-foreground">₹{totalPrice}</span></div>
                </div>
                <Button className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handleSchedule}>
                  {t("homeSample.schedule")} — ₹{totalPrice}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "confirmed" && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-16 max-w-md text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle2 className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Collection Scheduled!</h2>
              <p className="mt-2 text-muted-foreground">
                A phlebotomist from {selectedLab?.name} will visit your address tomorrow at {selectedSlot}. Reports within {selectedLab?.turnaround}.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={() => { setStep("lab"); setSelectedLab(null); setSelectedTests([]); setSelectedSlot(""); setAddress(""); }} variant="outline">Book Another</Button>
                <Link to="/"><Button className="bg-hero-gradient text-primary-foreground hover:opacity-90">Go Home</Button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default HomeSampleCollection;
