import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX, HiOutlineCheck } from "react-icons/hi";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../lib/api";
import useLanguageStore from "../store/useLanguageStore";
import PageHeader from "../components/PageHeader";

export default function CategoriesPage() {
  const { t, lang } = useLanguageStore();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(null); // { id, nameEn, nameAr } or { id: "new", ... }
  const [serverError, setServerError] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const createMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-categories"] }); setEditing(null); },
    onError: (err) => setServerError(err.response?.data?.error || t.error),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-categories"] }); setEditing(null); },
    onError: (err) => setServerError(err.response?.data?.error || t.error),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
    onError: (err) => setServerError(err.response?.data?.error || t.error),
  });

  const handleSave = () => {
    if (!editing) return;
    setServerError(null);
    const data = { nameEn: editing.nameEn, nameAr: editing.nameAr };
    if (editing.id === "new") {
      createMut.mutate(data);
    } else {
      updateMut.mutate({ id: editing.id, data });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDelete)) {
      setServerError(null);
      deleteMut.mutate(id);
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
      <PageHeader
        title={t.categories}
        actionLabel={t.addCategory}
        onAction={() => setEditing({ id: "new", nameEn: "", nameAr: "" })}
      />

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <div className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600 text-gray-500">
              <th className="px-5 py-3 text-start">{t.nameEn}</th>
              <th className="px-5 py-3 text-start">{t.nameAr}</th>
              <th className="px-5 py-3 text-start">{t.mealCount}</th>
              <th className="px-5 py-3 text-end">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {/* New category row */}
            {editing?.id === "new" && (
              <tr className="border-b border-surface-600 bg-brand/5">
                <td className="px-5 py-2">
                  <input
                    value={editing.nameEn}
                    onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })}
                    placeholder="Name (EN)"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
                  />
                </td>
                <td className="px-5 py-2">
                  <input
                    value={editing.nameAr}
                    onChange={(e) => setEditing({ ...editing, nameAr: e.target.value })}
                    placeholder="الاسم (AR)"
                    dir="rtl"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
                  />
                </td>
                <td className="px-5 py-2 text-gray-500">—</td>
                <td className="px-5 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={handleSave} className="p-2 rounded-lg hover:bg-brand/20 text-brand">
                      <HiOutlineCheck className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-surface-600 text-gray-400">
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {categories.map((cat) => {
              const isEditing = editing?.id === cat.id;
              return (
                <tr key={cat.id} className="border-b border-surface-600 last:border-0 hover:bg-surface-700/50">
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        value={editing.nameEn}
                        onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
                      />
                    ) : (
                      cat.nameEn
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        value={editing.nameAr}
                        onChange={(e) => setEditing({ ...editing, nameAr: e.target.value })}
                        dir="rtl"
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
                      />
                    ) : (
                      cat.nameAr
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{cat._count?.meals ?? 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button onClick={handleSave} className="p-2 rounded-lg hover:bg-brand/20 text-brand">
                            <HiOutlineCheck className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-surface-600 text-gray-400">
                            <HiOutlineX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditing({ id: cat.id, nameEn: cat.nameEn, nameAr: cat.nameAr })}
                            className="p-2 rounded-lg hover:bg-surface-600 text-gray-400 hover:text-white transition-colors"
                          >
                            <HiOutlinePencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {categories.length === 0 && !editing && (
          <div className="text-center py-10 text-gray-500">{t.noResults}</div>
        )}
      </div>
    </div>
  );
}
