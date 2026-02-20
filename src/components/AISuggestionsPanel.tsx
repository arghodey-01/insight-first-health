import { motion } from "framer-motion";
import { AlertCircle, Salad, HeartPulse, User } from "lucide-react";

const suggestions = [
  {
    icon: AlertCircle,
    title: "Possible Health Risks",
    items: ["Elevated LDL cholesterol — cardiovascular risk", "Low Vitamin D — bone density concern", "Borderline fasting glucose — pre-diabetic range"],
    confidence: 87,
    color: "border-destructive/30 bg-destructive/5",
    iconColor: "text-destructive",
  },
  {
    icon: Salad,
    title: "Diet Suggestions",
    items: ["Increase omega-3 fatty acids (salmon, walnuts)", "Add Vitamin D-rich foods (eggs, fortified milk)", "Reduce refined carbs & sugar intake"],
    confidence: 92,
    color: "border-secondary/30 bg-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: HeartPulse,
    title: "Lifestyle Advice",
    items: ["30 min daily cardio exercise", "Regular sleep schedule (7-8 hrs)", "Stress management & meditation"],
    confidence: 90,
    color: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: User,
    title: "Recommended Specialist",
    items: ["Endocrinologist for glucose management", "Cardiologist for cholesterol monitoring", "General physician for annual review"],
    confidence: 85,
    color: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
  },
];

const AISuggestionsPanel = () => {
  return (
    <section id="insights" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            AI Insights
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Personalized <span className="text-gradient">AI Suggestions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Based on your blood report, our AI generates actionable health recommendations with confidence scores.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {suggestions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border ${s.color} p-6 shadow-card`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                  <h3 className="font-semibold text-card-foreground">{s.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-hero-gradient"
                      style={{ width: `${s.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{s.confidence}%</span>
                </div>
              </div>
              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISuggestionsPanel;
