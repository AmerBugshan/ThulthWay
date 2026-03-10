import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useLanguageStore from "../store/useLanguageStore";

const categoryEmojis = {
  poultry: "🍗",
  beef: "🥩",
  seafood: "🐟",
  vegetarian: "🥗",
  "eggs-dairy": "🥚",
  grains: "🌾",
  other: "🍽️",
};

export default function MealPickerModal({ type, allMeals, onSelect, onClose }) {
  const { t, lang } = useLanguageStore();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = allMeals.filter((m) => m.type === type);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.nameEn.toLowerCase().includes(q) ||
          m.nameAr.includes(q)
      );
    }
    return list;
  }, [allMeals, type, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* Panel */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="relative bg-surface-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-surface-600"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-600">
          <h3 className="text-lg font-bold">{t.selectMeal}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-700 border border-surface-500 text-white placeholder-gray-500 focus:outline-none focus:border-brand text-sm"
          />
        </div>

        {/* Meals grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-500">{t.noMeals}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => onSelect(meal)}
                  className="rounded-xl p-4 bg-surface-700 border border-surface-500 hover:border-brand/50 text-start transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Image or emoji */}
                    <div className="w-14 h-14 rounded-lg bg-surface-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {meal.imageUrl ? (
                        <img
                          src={meal.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.textContent =
                              categoryEmojis[meal.category?.slug] || "🍽️";
                          }}
                        />
                      ) : (
                        <span className="text-2xl">
                          {categoryEmojis[meal.category?.slug] || "🍽️"}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {lang === "ar" ? meal.nameAr : meal.nameEn}
                      </h4>
                      <div className="text-xs text-gray-400 mt-1">
                        {meal.calories} kcal · {meal.protein}g P
                      </div>

                      {/* Macro ratio bar */}
                      <MacroBar
                        protein={meal.protein}
                        carbs={meal.carbs}
                        fat={meal.fat}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MacroBar({ protein, carbs, fat }) {
  const total = protein + carbs + fat;
  if (total === 0) return null;
  const pPct = (protein / total) * 100;
  const cPct = (carbs / total) * 100;
  const fPct = (fat / total) * 100;

  return (
    <div className="flex rounded-full h-1.5 mt-2 overflow-hidden bg-surface-500">
      <div className="bg-red-400" style={{ width: `${pPct}%` }} title={`Protein ${Math.round(pPct)}%`} />
      <div className="bg-blue-400" style={{ width: `${cPct}%` }} title={`Carbs ${Math.round(cPct)}%`} />
      <div className="bg-orange-400" style={{ width: `${fPct}%` }} title={`Fat ${Math.round(fPct)}%`} />
    </div>
  );
}
