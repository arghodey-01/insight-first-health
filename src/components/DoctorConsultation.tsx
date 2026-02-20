import { motion } from "framer-motion";
import { Star, Video, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const doctors = [
  { name: "Dr. Priya Sharma", specialty: "Cardiologist", rating: 4.9, reviews: 312, available: true, image: "👩‍⚕️" },
  { name: "Dr. Rajesh Patel", specialty: "Endocrinologist", rating: 4.8, reviews: 245, available: true, image: "👨‍⚕️" },
  { name: "Dr. Anita Desai", specialty: "General Physician", rating: 4.7, reviews: 189, available: false, image: "👩‍⚕️" },
  { name: "Dr. Vikram Singh", specialty: "Hematologist", rating: 4.9, reviews: 276, available: true, image: "👨‍⚕️" },
];

const DoctorConsultation = () => {
  return (
    <section id="doctors" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
            Expert Doctors
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Consult <span className="text-gradient">Verified Specialists</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            AI recommends the right specialist based on your report. Book instantly.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="mb-4 text-5xl">{doc.image}</div>
              <h3 className="font-semibold text-card-foreground">{doc.name}</h3>
              <p className="text-sm text-muted-foreground">{doc.specialty}</p>

              <div className="mt-3 flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{doc.rating}</span>
                <span className="text-xs text-muted-foreground">({doc.reviews})</span>
              </div>

              <div className="mt-2">
                {doc.available ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
                    <span className="h-2 w-2 rounded-full bg-secondary animate-pulse-soft" />
                    Available Now
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Next available: Tomorrow</span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <MessageCircle className="mr-1 h-3 w-3" /> Chat
                </Button>
                <Button size="sm" className="flex-1 bg-hero-gradient text-primary-foreground text-xs hover:opacity-90">
                  <Video className="mr-1 h-3 w-3" /> Video
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorConsultation;
