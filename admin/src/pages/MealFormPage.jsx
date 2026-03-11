import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMeals, fetchCategories, createMeal, updateMeal } from "../lib/api";
import useLanguageStore from "../store/useLanguageStore";

export default function MealFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, lang } = useLanguageStore();

  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    type: "MAIN",
    categoryId: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    slug: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [serverError, setServerError] = useState(null);

  const { data: meals = [] } = useQuery({
    queryKey: ["admin-meals"],
    queryFn: fetchMeals,
    enabled: isEdit,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  // Pre-fill on edit
  useEffect(() => {
    if (isEdit && meals.length > 0) {
      const meal = meals.find((m) => m.id === id);
      if (meal) {
        setForm({
          nameEn: meal.nameEn,
          nameAr: meal.nameAr,
          type: meal.type,
          categoryId: meal.categoryId || "",
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          fiber: meal.fiber,
          slug: meal.slug || "",
        });
        if (meal.imageUrl) setPreview(meal.imageUrl);
      }
    }
  }, [isEdit, meals, id]);

  const mutation = useMutation({
    mutationFn: (formData) => (isEdit ? updateMeal(id, formData) : createMeal(formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-meals"] });
      navigate("/meals");
    },
    onError: (err) => {
      setServerError(err.response?.data?.error || t.error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData();
    fd.append("nameEn", form.nameEn);
    fd.append("nameAr", form.nameAr);
    fd.append("type", form.type);
    fd.append("calories", form.calories);
    fd.append("protein", form.protein);
    fd.append("carbs", form.carbs);
    fd.append("fat", form.fat);
    fd.append("fiber", form.fiber);
    if (form.slug) fd.append("slug", form.slug);
    if (form.categoryId) fd.append("categoryId", form.categoryId);
    if (imageFile) fd.append("image", imageFile);
    mutation.mutate(fd);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">{isEdit ? t.editMeal : t.addMeal}</h1>

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Names */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.nameEn} value={form.nameEn} onChange={set("nameEn")} required />
          <Field label={t.nameAr} value={form.nameAr} onChange={set("nameAr")} required dir="rtl" />
        </div>

        {/* Type + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">{t.type}</label>
            <select
              value={form.type}
              onChange={set("type")}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
            >
              <option value="MAIN">{t.main}</option>
              <option value="BREAKFAST">{t.breakfast}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">{t.category}</label>
            <select
              value={form.categoryId}
              onChange={set("categoryId")}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === "ar" ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nutrition */}
        <div className="grid grid-cols-5 gap-3">
          <Field label={t.calories} value={form.calories} onChange={set("calories")} type="number" required />
          <Field label={t.protein} value={form.protein} onChange={set("protein")} type="number" required />
          <Field label={t.carbs} value={form.carbs} onChange={set("carbs")} type="number" required />
          <Field label={t.fat} value={form.fat} onChange={set("fat")} type="number" required />
          <Field label={t.fiber} value={form.fiber} onChange={set("fiber")} type="number" required />
        </div>

        {/* Slug */}
        <Field label={t.slug} value={form.slug} onChange={set("slug")} placeholder="auto-generated" />

        {/* Image */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t.image}</label>
          <div className="flex items-center gap-4">
            {preview && (
              <img src={preview} alt="" className="w-16 h-16 rounded-xl object-cover" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-surface-600 file:text-white file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-surface-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-black font-bold text-sm transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? t.loading : isEdit ? t.save : t.create}
          </button>
          <button
            type="button"
            onClick={() => navigate("/meals")}
            className="px-6 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, dir, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        dir={dir}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        className="w-full px-4 py-2.5 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand placeholder:text-gray-600"
      />
    </div>
  );
}
