import { motion } from "framer-motion";
import { ShieldCheck, Brain, UserCheck, Lock } from "lucide-react";

const trustItems = [
  { icon: Lock, title: "HIPAA-Grade Privacy", desc: "Your health data is encrypted end-to-end and never shared without consent." },
  { icon: Brain, title: "AI-Verified Insights", desc: "All AI interpretations are validated against medical databases and guidelines." },
  { icon: UserCheck, title: "Doctor-Reviewed", desc: "Critical findings are flagged for review by certified medical professionals." },
  { icon: ShieldCheck, title: "Certified & Compliant", desc: "Platform follows international healthcare data protection standards." },
];

const TrustSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
            Trust & Safety
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Your Health Data is <span className="text-gradient">Safe With Us</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-hero-gradient shadow-card-lg">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
