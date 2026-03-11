import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { fetchMeals, deleteMeal } from "../lib/api";
import useLanguageStore from "../store/useLanguageStore";
import PageHeader from "../components/PageHeader";

export default function MealsPage() {
  const { t, lang } = useLanguageStore();
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["admin-meals"],
    queryFn: fetchMeals,
  });

  const removeMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-meals"] }),
  });

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDelete)) {
      removeMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t.meals} actionLabel={t.addMeal} actionTo="/meals/new" />

      {removeMutation.isError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {removeMutation.error?.response?.data?.error || t.error}
        </div>
      )}

      <div className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600 text-gray-500 text-start">
              <th className="px-5 py-3 text-start">{t.image}</th>
              <th className="px-5 py-3 text-start">{t.mealName}</th>
              <th className="px-5 py-3 text-start">{t.type}</th>
              <th className="px-5 py-3 text-start">{t.category}</th>
              <th className="px-5 py-3 text-start">{t.calories}</th>
              <th className="px-5 py-3 text-start">{t.protein}</th>
              <th className="px-5 py-3 text-end">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id} className="border-b border-surface-600 last:border-0 hover:bg-surface-700/50">
                <td className="px-5 py-3">
                  {meal.imageUrl ? (
                    <img src={meal.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-surface-600 flex items-center justify-center text-gray-500 text-lg">
                      🍽️
                    </div>
                  )}
                </td>
                <td className="px-5 py-3 font-medium">
                  {lang === "ar" ? meal.nameAr : meal.nameEn}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    meal.type === "BREAKFAST"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {meal.type === "BREAKFAST" ? t.breakfast : t.main}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">
                  {meal.category ? (lang === "ar" ? meal.category.nameAr : meal.category.nameEn) : "—"}
                </td>
                <td className="px-5 py-3 text-gray-400">{meal.calories}</td>
                <td className="px-5 py-3 text-gray-400">{meal.protein}g</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/meals/${meal.id}/edit`}
                      className="p-2 rounded-lg hover:bg-surface-600 text-gray-400 hover:text-white transition-colors"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(meal.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {meals.length === 0 && (
          <div className="text-center py-10 text-gray-500">{t.noResults}</div>
        )}
      </div>
    </div>
  );
}
