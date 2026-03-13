import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Clock, ArrowLeft, CheckCircle2, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const doctorsList = [
  { id: 1, name: "Dr. Priya Sharma", specialty: "Cardiologist", hospital: "Apollo Hospital, Delhi", experience: "15 years", rating: 4.9, reviews: 312, fee: 800, available: true, image: "👩‍⚕️", slots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
  { id: 2, name: "Dr. Rajesh Patel", specialty: "Endocrinologist", hospital: "Fortis Healthcare, Mumbai", experience: "12 years", rating: 4.8, reviews: 245, fee: 700, available: true, image: "👨‍⚕️", slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
  { id: 3, name: "Dr. Anita Desai", specialty: "General Physician", hospital: "Max Hospital, Bangalore", experience: "10 years", rating: 4.7, reviews: 189, fee: 500, available: true, image: "👩‍⚕️", slots: ["10:30 AM", "1:00 PM", "5:00 PM"] },
  { id: 4, name: "Dr. Vikram Singh", specialty: "Hematologist", hospital: "AIIMS, Delhi", experience: "20 years", rating: 4.9, reviews: 276, fee: 1000, available: true, image: "👨‍⚕️", slots: ["9:30 AM", "12:00 PM", "3:30 PM"] },
  { id: 5, name: "Dr. Meera Nair", specialty: "Nutritionist", hospital: "Manipal Hospital, Chennai", experience: "8 years", rating: 4.6, reviews: 156, fee: 600, available: true, image: "👩‍⚕️", slots: ["10:00 AM", "2:30 PM", "4:00 PM"] },
  { id: 6, name: "Dr. Suresh Kumar", specialty: "Diabetologist", hospital: "Medanta, Gurugram", experience: "18 years", rating: 4.8, reviews: 298, fee: 900, available: true, image: "👨‍⚕️", slots: ["11:00 AM", "1:30 PM", "5:30 PM"] },
];

type Step = "list" | "slots" | "payment" | "confirmed";

const DoctorBooking = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("list");
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctorsList[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [paymentForm, setPaymentForm] = useState({ name: "", card: "", expiry: "", cvv: "" });

  const selectDoctor = (doc: typeof doctorsList[0]) => {
    setSelectedDoctor(doc);
    setStep("slots");
  };

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setStep("payment");
  };

  const handlePay = () => {
    if (!paymentForm.name || !paymentForm.card || !paymentForm.expiry || !paymentForm.cvv) {
      toast({ title: "Please fill all payment details", variant: "destructive" });
      return;
    }
    setStep("confirmed");
    toast({ title: t("doctors.bookingConfirmed") });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6 flex items-center gap-4">
          {step !== "list" ? (
            <button onClick={() => setStep(step === "confirmed" ? "list" : step === "payment" ? "slots" : "list")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t("doctors.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("doctors.subtitle")}</p>

        <AnimatePresence mode="wait">
          {/* Doctor List */}
          {step === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doctorsList.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
                >
                  <div className="text-5xl mb-3">{doc.image}</div>
                  <h3 className="font-semibold text-card-foreground">{doc.name}</h3>
                  <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{doc.hospital}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {doc.rating} ({doc.reviews})</span>
                    <span>{doc.experience}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">₹{doc.fee}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
                      <span className="h-2 w-2 rounded-full bg-secondary animate-pulse-soft" />
                      {t("doctors.available")}
                    </span>
                  </div>
                  <Button size="sm" className="mt-4 w-full bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={() => selectDoctor(doc)}>
                    {t("doctors.bookNow")}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Slot Selection */}
          {step === "slots" && selectedDoctor && (
            <motion.div key="slots" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-8 max-w-lg">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">{selectedDoctor.image}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedDoctor.name}</h3>
                    <p className="text-sm text-primary">{selectedDoctor.specialty}</p>
                    <p className="text-xs text-muted-foreground">{selectedDoctor.hospital}</p>
                  </div>
                </div>
                <h4 className="font-medium text-foreground flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4" /> {t("doctors.selectSlot")} — Today
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDoctor.slots.map((slot) => (
                    <Button key={slot} variant="outline" size="sm" className={`text-xs ${selectedSlot === slot ? "border-primary bg-primary/10 text-primary" : ""}`} onClick={() => selectSlot(slot)}>
                      <Clock className="mr-1 h-3 w-3" /> {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment */}
          {step === "payment" && selectedDoctor && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-8 max-w-lg">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5" /> {t("doctors.payment")}
                </h3>
                <div className="mb-6 rounded-lg bg-muted p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{selectedDoctor.name} — {selectedSlot}</span>
                    <span className="font-bold text-foreground">₹{selectedDoctor.fee}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input className="mt-1" placeholder="John Doe" value={paymentForm.name} onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <Input className="mt-1" placeholder="4242 4242 4242 4242" value={paymentForm.card} onChange={(e) => setPaymentForm({ ...paymentForm, card: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry</Label>
                      <Input className="mt-1" placeholder="MM/YY" value={paymentForm.expiry} onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })} />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input className="mt-1" placeholder="123" type="password" value={paymentForm.cvv} onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })} />
                    </div>
                  </div>
                  <Button className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handlePay}>
                    {t("doctors.payNow")} — ₹{selectedDoctor.fee}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Confirmed */}
          {step === "confirmed" && selectedDoctor && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-16 max-w-md text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle2 className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("doctors.bookingConfirmed")}</h2>
              <p className="mt-2 text-muted-foreground">
                Your appointment with {selectedDoctor.name} at {selectedDoctor.hospital} is confirmed for today at {selectedSlot}.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={() => { setStep("list"); setSelectedDoctor(null); setSelectedSlot(""); }} variant="outline">Book Another</Button>
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

export default DoctorBooking;
