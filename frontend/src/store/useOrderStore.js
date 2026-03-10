import { create } from "zustand";

const useOrderStore = create((set, get) => ({
  step: 1,
  subscriptionType: null,
  plan: null,
  // meals[day][slot] = meal object or null
  // day: 0-4 (Sun-Thu), slot: 0-2 (breakfast, main1, main2)
  meals: Array.from({ length: 5 }, () => Array(3).fill(null)),

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  setSubscription: (sub) => set({ subscriptionType: sub }),
  setPlan: (plan) => set({ plan }),

  setMeal: (day, slot, meal) =>
    set((state) => {
      const meals = state.meals.map((d) => [...d]);
      meals[day][slot] = meal;
      return { meals };
    }),

  removeMeal: (day, slot) =>
    set((state) => {
      const meals = state.meals.map((d) => [...d]);
      meals[day][slot] = null;
      return { meals };
    }),

  getTotals: () => {
    const { meals } = get();
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    for (const day of meals) {
      for (const meal of day) {
        if (meal) {
          calories += meal.calories || 0;
          protein += meal.protein || 0;
          carbs += meal.carbs || 0;
          fat += meal.fat || 0;
        }
      }
    }
    return {
      calories: Math.round(calories * 10) / 10,
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  },

  getSlotConfig: () => {
    const { plan } = get();
    if (!plan) return { breakfastSlots: 0, mainSlots: 0 };
    return {
      breakfastSlots: plan.breakfastSlots,
      mainSlots: plan.mainSlots,
    };
  },

  reset: () =>
    set({
      step: 1,
      subscriptionType: null,
      plan: null,
      meals: Array.from({ length: 5 }, () => Array(3).fill(null)),
    }),
}));

export default useOrderStore;
