import { motion } from "framer-motion";
import useOrderStore from "../store/useOrderStore";
import useLanguageStore from "../store/useLanguageStore";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const planIcons = {
  "breakfast-only": "🌅",
  "main-only": "🍖",
  "breakfast-main": "🍳🍖",
  "two-mains": "🍖🍖",
  "full-package": "👑",
};

export default function StepPlan() {
  const { t, lang } = useLanguageStore();
  const { subscriptionType, setPlan, nextStep, prevStep, plan: selectedPlan } = useOrderStore();

  if (!subscriptionType) return null;

  const plans = [...subscriptionType.plans].sort((a, b) => a.price - b.price);

  const handleSelect = (plan) => {
    setPlan(plan);
    nextStep();
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t.step2Title}</h2>
      <p className="text-gray-400 text-center mb-10">
        {lang === "ar" ? subscriptionType.nameAr : subscriptionType.nameEn}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const name = lang === "ar" ? plan.nameAr : plan.nameEn;
          const selected = selectedPlan?.id === plan.id;
          return (
            <motion.button
              key={plan.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(plan)}
              className={`rounded-2xl p-6 text-start border transition-all ${
                selected
                  ? "border-brand bg-brand/10 ring-2 ring-brand"
                  : "border-surface-600 bg-surface-800 hover:border-surface-500"
              }`}
            >
              <div className="text-3xl mb-3">{planIcons[plan.slug] || "🍽️"}</div>
              <h3 className="text-lg font-bold mb-1">{name}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {plan.breakfastSlots > 0 && `${plan.breakfastSlots} ${t.breakfast}`}
                {plan.breakfastSlots > 0 && plan.mainSlots > 0 && " + "}
                {plan.mainSlots > 0 && `${plan.mainSlots} ${t.mainDish}`}
              </p>
              <div className="text-2xl font-bold text-brand">
                {plan.price} <span className="text-sm font-normal text-gray-400">{t.perWeek}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold transition-colors"
        >
          {t.back}
        </button>
      </div>
    </motion.div>
  );
}
