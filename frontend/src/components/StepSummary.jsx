import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../lib/api";
import useOrderStore from "../store/useOrderStore";
import useLanguageStore from "../store/useLanguageStore";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function StepSummary() {
  const { t, lang } = useLanguageStore();
  const navigate = useNavigate();
  const { subscriptionType, plan, meals, getTotals, reset, getSlotConfig } =
    useOrderStore();
  const [orderId, setOrderId] = useState(null);

  const totals = getTotals();
  const { breakfastSlots, mainSlots } = getSlotConfig();

  const slots = [];
  for (let s = 0; s < breakfastSlots; s++) slots.push({ index: 0, label: t.slotBreakfast });
  for (let s = 0; s < mainSlots; s++) slots.push({ index: 1 + s, label: s === 0 ? t.slotMain1 : t.slotMain2 });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => setOrderId(data.id),
  });

  const handleSubmit = () => {
    const mealSelections = [];
    for (let day = 0; day < 5; day++) {
      for (const slot of slots) {
        const meal = meals[day][slot.index];
        if (meal) {
          mealSelections.push({ day, slot: slot.index, mealId: meal.id });
        }
      }
    }

    mutation.mutate({
      subscriptionTypeId: subscriptionType.id,
      planId: plan.id,
      meals: mealSelections,
    });
  };

  // Success screen
  if (orderId) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-center py-16"
      >
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-brand">{t.orderSuccess}</h2>
        <p className="text-gray-400 mb-2">{t.orderSuccessMsg}</p>
        <p className="text-gray-500 text-sm mb-8">
          {t.orderNumber}
          <span className="font-mono text-white">{orderId.slice(0, 8)}</span>
        </p>
        <button
          onClick={() => { reset(); navigate("/"); }}
          className="px-8 py-3 rounded-xl bg-brand hover:bg-brand-dark text-black font-bold transition-colors"
        >
          {t.newOrder}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t.step4Title}</h2>

      {/* Summary info */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-surface-800 rounded-2xl p-6 border border-surface-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">{t.subscription}</div>
              <div className="font-bold">
                {lang === "ar" ? subscriptionType.nameAr : subscriptionType.nameEn}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{t.plan}</div>
              <div className="font-bold">
                {lang === "ar" ? plan.nameAr : plan.nameEn}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{t.price}</div>
              <div className="font-bold text-brand">
                {plan.price} {t.sar}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly nutrition totals */}
        <div className="bg-surface-800 rounded-2xl p-6 border border-surface-600">
          <h3 className="font-bold mb-3">{t.weeklyTotals}</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <Stat label={t.calories} value={totals.calories} color="text-yellow-400" />
            <Stat label={t.protein} value={`${totals.protein}g`} color="text-red-400" />
            <Stat label={t.carbs} value={`${totals.carbs}g`} color="text-blue-400" />
            <Stat label={t.fat} value={`${totals.fat}g`} color="text-orange-400" />
          </div>
        </div>

        {/* Weekly schedule */}
        <div className="bg-surface-800 rounded-2xl p-6 border border-surface-600">
          <h3 className="font-bold mb-4">{t.yourWeek}</h3>
          <div className="space-y-3">
            {t.days.map((dayName, dayIndex) => (
              <div
                key={dayIndex}
                className="flex items-start gap-4 py-2 border-b border-surface-600 last:border-0"
              >
                <span className="text-brand font-semibold w-20 flex-shrink-0 text-sm pt-0.5">
                  {t.daysShort[dayIndex]}
                </span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {slots.map((slot) => {
                    const meal = meals[dayIndex][slot.index];
                    return meal ? (
                      <span
                        key={slot.index}
                        className="text-xs bg-surface-600 px-3 py-1.5 rounded-lg"
                      >
                        {lang === "ar" ? meal.nameAr : meal.nameEn}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center pb-10">
          <button
            onClick={() => navigate("/order/week")}
            className="px-6 py-3 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold transition-colors"
          >
            {t.back}
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-8 py-3 rounded-xl bg-brand hover:bg-brand-dark text-black font-bold transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? t.loading : t.submit}
          </button>
        </div>

        {mutation.isError && (
          <div className="text-center text-red-400 text-sm">
            {mutation.error?.response?.data?.error || t.error}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`font-bold text-lg ${color}`}>{value}</div>
    </div>
  );
}
