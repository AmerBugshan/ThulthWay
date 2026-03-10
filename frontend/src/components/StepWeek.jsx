import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchMeals } from "../lib/api";
import useOrderStore from "../store/useOrderStore";
import useLanguageStore from "../store/useLanguageStore";
import MealPickerModal from "./MealPickerModal";
import NutritionBar from "./NutritionBar";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const categoryEmojis = {
  poultry: "🍗",
  beef: "🥩",
  seafood: "🐟",
  vegetarian: "🥗",
  "eggs-dairy": "🥚",
  grains: "🌾",
  other: "🍽️",
};

export default function StepWeek() {
  const { t, lang } = useLanguageStore();
  const { plan, meals, setMeal, removeMeal, prevStep, nextStep, getTotals, getSlotConfig } =
    useOrderStore();
  const [modal, setModal] = useState(null); // { day, slot, type }

  const { data: allMeals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: () => fetchMeals(),
  });

  if (!plan) return null;

  const { breakfastSlots, mainSlots } = getSlotConfig();
  const totals = getTotals();

  const slots = [];
  for (let s = 0; s < breakfastSlots; s++) slots.push({ index: 0, type: "BREAKFAST", label: t.slotBreakfast });
  for (let s = 0; s < mainSlots; s++) slots.push({ index: 1 + s, type: "MAIN", label: s === 0 ? t.slotMain1 : t.slotMain2 });

  const openPicker = (day, slotIndex, type) => setModal({ day, slot: slotIndex, type });

  const handleSelectMeal = (meal) => {
    if (modal) {
      setMeal(modal.day, modal.slot, meal);
      setModal(null);
    }
  };

  const canProceed = () => {
    for (let d = 0; d < 5; d++) {
      for (const slot of slots) {
        if (!meals[d][slot.index]) return false;
      }
    }
    return true;
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t.step3Title}</h2>

      {/* Day grid */}
      <div className="space-y-4">
        {t.days.map((dayName, dayIndex) => (
          <div key={dayIndex} className="bg-surface-800 rounded-2xl p-4 border border-surface-600">
            <h3 className="font-bold text-brand mb-3">{dayName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const meal = meals[dayIndex][slot.index];
                return (
                  <button
                    key={slot.index}
                    onClick={() =>
                      meal
                        ? removeMeal(dayIndex, slot.index)
                        : openPicker(dayIndex, slot.index, slot.type)
                    }
                    className={`rounded-xl p-3 text-start border transition-all min-h-[80px] ${
                      meal
                        ? "border-brand/30 bg-brand/5"
                        : "border-dashed border-surface-500 bg-surface-700 hover:border-brand/50"
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">{slot.label}</div>
                    {meal ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {meal.imageUrl ? (
                            <img
                              src={meal.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                              }}
                            />
                          ) : null}
                          <span style={{ display: meal.imageUrl ? "none" : "block" }}>
                            {categoryEmojis[meal.category?.slug] || "🍽️"}
                          </span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {lang === "ar" ? meal.nameAr : meal.nameEn}
                          </div>
                          <div className="text-xs text-gray-400">
                            {meal.calories} {t.calories} · {meal.protein}g {t.protein}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">{t.emptySlot}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky nutrition bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-800/95 backdrop-blur-md border-t border-surface-600 px-4 py-3 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-400 font-semibold hidden sm:inline">{t.weeklyTotals}:</span>
            <NutritionBar label={t.calories} value={totals.calories} color="text-yellow-400" />
            <NutritionBar label={t.protein} value={`${totals.protein}g`} color="text-red-400" />
            <NutritionBar label={t.carbs} value={`${totals.carbs}g`} color="text-blue-400" />
            <NutritionBar label={t.fat} value={`${totals.fat}g`} color="text-orange-400" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={prevStep}
              className="px-5 py-2 rounded-xl bg-surface-600 hover:bg-surface-500 text-sm font-semibold transition-colors"
            >
              {t.back}
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                canProceed()
                  ? "bg-brand hover:bg-brand-dark text-black"
                  : "bg-surface-600 text-gray-500 cursor-not-allowed"
              }`}
            >
              {t.next}
            </button>
          </div>
        </div>
      </div>

      {/* Meal picker modal */}
      {modal && (
        <MealPickerModal
          type={modal.type}
          allMeals={allMeals}
          onSelect={handleSelectMeal}
          onClose={() => setModal(null)}
        />
      )}
    </motion.div>
  );
}
