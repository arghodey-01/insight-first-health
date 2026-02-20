import { motion } from "framer-motion";
import { Upload, ScanSearch, AlertTriangle, Lightbulb, UserCheck } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Report", desc: "Upload your blood test PDF or image" },
  { icon: ScanSearch, label: "AI Scan", desc: "Our AI reads every biomarker" },
  { icon: AlertTriangle, label: "Risk Detection", desc: "Flags abnormal values & patterns" },
  { icon: Lightbulb, label: "Suggestions", desc: "Personalized health recommendations" },
  { icon: UserCheck, label: "Doctor Referral", desc: "Connect with the right specialist" },
];

const WorkflowSection = () => {
  return (
    <section id="workflow" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
            How It Works
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            From Upload to <span className="text-gradient">Insight</span> in Minutes
          </h2>
        </motion.div>

        <div className="relative flex flex-col items-center gap-0 md:flex-row md:justify-between md:gap-0">
          {/* Connector line */}
          <div className="absolute left-1/2 top-6 hidden h-0.5 w-[80%] -translate-x-1/2 bg-gradient-to-r from-primary via-primary/50 to-secondary md:block" />
          <div className="absolute left-6 top-0 block h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-secondary md:hidden" />

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 flex items-start gap-4 py-6 md:flex-col md:items-center md:py-0 md:text-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card shadow-card-hover">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="md:mt-4">
                <p className="font-semibold text-foreground">{step.label}</p>
                <p className="mt-1 max-w-[160px] text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sample Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            { label: "Hemoglobin", value: "13.5 g/dL", status: "Normal", statusColor: "text-secondary" },
            { label: "Cholesterol", value: "242 mg/dL", status: "High", statusColor: "text-destructive" },
            { label: "Blood Sugar", value: "110 mg/dL", status: "Borderline", statusColor: "text-primary" },
            { label: "Vitamin D", value: "18 ng/mL", status: "Low", statusColor: "text-destructive" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border bg-card p-4 text-center shadow-card"
            >
              <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-xl font-bold text-card-foreground">{m.value}</p>
              <p className={`mt-1 text-xs font-semibold ${m.statusColor}`}>{m.status}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowSection;
