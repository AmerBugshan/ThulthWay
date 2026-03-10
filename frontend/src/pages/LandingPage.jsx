import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useLanguageStore from "../store/useLanguageStore";

const steps = [
  { key: "howStep1", descKey: "howStep1Desc", icon: "🎯" },
  { key: "howStep2", descKey: "howStep2Desc", icon: "📋" },
  { key: "howStep3", descKey: "howStep3Desc", icon: "🍽️" },
  { key: "howStep4", descKey: "howStep4Desc", icon: "🚀" },
];

export default function LandingPage() {
  const { t } = useLanguageStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Hero */}
      <section className="text-center py-20 md:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          {t.heroTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          {t.heroSubtitle}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/order/subscription")}
          className="px-10 py-4 rounded-2xl bg-brand hover:bg-brand-dark text-black text-lg font-bold transition-colors"
        >
          {t.getStarted}
        </motion.button>
      </section>

      {/* How it works */}
      <section className="py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t.howItWorks}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="bg-surface-800 border border-surface-600 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-sm text-brand font-bold mb-1">
                {i + 1}
              </div>
              <h3 className="font-bold mb-2">{t[step.key]}</h3>
              <p className="text-gray-400 text-sm">{t[step.descKey]}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
