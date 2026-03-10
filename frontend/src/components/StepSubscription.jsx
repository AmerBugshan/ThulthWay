import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchSubscriptions } from "../lib/api";
import useOrderStore from "../store/useOrderStore";
import useLanguageStore from "../store/useLanguageStore";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const icons = {
  cutting: "🔥",
  maintenance: "⚖️",
  bulk: "💪",
};

export default function StepSubscription() {
  const { t, lang } = useLanguageStore();
  const { setSubscription, nextStep, subscriptionType } = useOrderStore();

  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });

  if (isLoading) return <Loading text={t.loading} />;
  if (error) return <Error text={t.error} />;

  const handleSelect = (sub) => {
    setSubscription(sub);
    nextStep();
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t.step1Title}</h2>
      <p className="text-gray-400 text-center mb-10">{t.tagline}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptions.map((sub) => {
          const name = lang === "ar" ? sub.nameAr : sub.nameEn;
          const selected = subscriptionType?.id === sub.id;
          return (
            <motion.button
              key={sub.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(sub)}
              className={`rounded-2xl p-6 text-start border transition-all ${
                selected
                  ? "border-brand bg-brand/10 ring-2 ring-brand"
                  : "border-surface-600 bg-surface-800 hover:border-surface-500"
              }`}
            >
              <div className="text-4xl mb-3">{icons[sub.slug] || "🍽️"}</div>
              <h3 className="text-xl font-bold mb-4">{name}</h3>

              <div className="space-y-2">
                {sub.plans
                  .sort((a, b) => a.price - b.price)
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="flex justify-between text-sm py-1.5 border-b border-surface-600 last:border-0"
                    >
                      <span className="text-gray-400">
                        {lang === "ar" ? plan.nameAr : plan.nameEn}
                      </span>
                      <span className="font-semibold text-brand">
                        {plan.price} {t.sar}
                      </span>
                    </div>
                  ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function Loading({ text }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      <span className="ml-3 text-gray-400">{text}</span>
    </div>
  );
}

function Error({ text }) {
  return (
    <div className="text-center py-20 text-red-400">{text}</div>
  );
}
