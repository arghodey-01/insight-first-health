import { motion } from "framer-motion";
import { MapPin, Clock, Home, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const labs = [
  { name: "HealthScan Diagnostics", distance: "1.2 km", price: "₹499", homeCollection: true, time: "Reports in 6 hrs" },
  { name: "CityLab Pathology", distance: "2.8 km", price: "₹399", homeCollection: true, time: "Reports in 12 hrs" },
  { name: "MedTest Center", distance: "3.5 km", price: "₹349", homeCollection: false, time: "Reports in 24 hrs" },
];

const NearbyLabs = () => {
  return (
    <section id="labs" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Find Labs
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Nearby <span className="text-gradient">Diagnostic Labs</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Book tests at accredited labs near you. Home collection available.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-4">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{lab.name}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {lab.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> {lab.price}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {lab.time}
                  </span>
                  {lab.homeCollection && (
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <Home className="h-3 w-3" /> Home Collection
                    </span>
                  )}
                </div>
              </div>
              <Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90 shrink-0">
                Book Now
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-card"
        >
          <div className="flex h-48 items-center justify-center bg-muted">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Interactive map loads here</p>
              <p className="text-xs text-muted-foreground">Showing labs within 5 km radius</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NearbyLabs;
