import { motion } from "framer-motion";
import { FlaskConical, Bot, Stethoscope, MapPin, BarChart3, Dna } from "lucide-react";

const services = [
  {
    icon: FlaskConical,
    title: "Blood Report Analyzer",
    description: "AI-powered interpretation of your blood test results in plain language.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Bot,
    title: "AI Health Risk Prediction",
    description: "Predictive insights to catch health risks before they become problems.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Stethoscope,
    title: "Doctor Consultation",
    description: "Connect with verified specialists via video or chat instantly.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MapPin,
    title: "Nearby Test Centers",
    description: "Find accredited diagnostic labs near you with pricing and home collection.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: BarChart3,
    title: "Health Dashboard",
    description: "Track your health trends over time with interactive charts and alerts.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Dna,
    title: "Preventive Recommendations",
    description: "Personalized lifestyle, diet, and screening recommendations from AI.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

const ServicesGrid = () => {
  return (
    <section id="services" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Smart Services
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Everything You Need for{" "}
            <span className="text-gradient">Smarter Health</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From instant AI analysis to doctor consultations — all in one platform.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
