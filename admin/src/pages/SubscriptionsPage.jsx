import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import {
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  createPlan,
  updatePlan,
  deletePlan,
} from "../lib/api";
import useLanguageStore from "../store/useLanguageStore";
import PageHeader from "../components/PageHeader";

export default function SubscriptionsPage() {
  const { t, lang } = useLanguageStore();
  const queryClient = useQueryClient();

  const [expanded, setExpanded] = useState(null);
  const [subModal, setSubModal] = useState(null); // { mode: "create"|"edit", data }
  const [planModal, setPlanModal] = useState(null); // { mode: "create"|"edit", subId, data }
  const [serverError, setServerError] = useState(null);

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: fetchSubscriptions,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });

  const createSubMut = useMutation({ mutationFn: createSubscription, onSuccess: () => { invalidate(); setSubModal(null); }, onError: (e) => setServerError(e.response?.data?.error || t.error) });
  const updateSubMut = useMutation({ mutationFn: ({ id, data }) => updateSubscription(id, data), onSuccess: () => { invalidate(); setSubModal(null); }, onError: (e) => setServerError(e.response?.data?.error || t.error) });
  const deleteSubMut = useMutation({ mutationFn: deleteSubscription, onSuccess: invalidate, onError: (e) => setServerError(e.response?.data?.error || t.error) });

  const createPlanMut = useMutation({ mutationFn: ({ subId, data }) => createPlan(subId, data), onSuccess: () => { invalidate(); setPlanModal(null); }, onError: (e) => setServerError(e.response?.data?.error || t.error) });
  const updatePlanMut = useMutation({ mutationFn: ({ id, data }) => updatePlan(id, data), onSuccess: () => { invalidate(); setPlanModal(null); }, onError: (e) => setServerError(e.response?.data?.error || t.error) });
  const deletePlanMut = useMutation({ mutationFn: deletePlan, onSuccess: invalidate, onError: (e) => setServerError(e.response?.data?.error || t.error) });

  const handleSubSave = () => {
    setServerError(null);
    const data = { nameEn: subModal.data.nameEn, nameAr: subModal.data.nameAr };
    if (subModal.mode === "create") createSubMut.mutate(data);
    else updateSubMut.mutate({ id: subModal.data.id, data });
  };

  const handlePlanSave = () => {
    setServerError(null);
    const d = planModal.data;
    const data = {
      nameEn: d.nameEn,
      nameAr: d.nameAr,
      slug: d.slug,
      price: Number(d.price),
      breakfastSlots: Number(d.breakfastSlots) || 0,
      mainSlots: Number(d.mainSlots) || 0,
    };
    if (planModal.mode === "create") createPlanMut.mutate({ subId: planModal.subId, data });
    else updatePlanMut.mutate({ id: d.id, data });
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
        title={t.subscriptions}
        actionLabel={t.addSubscription}
        onAction={() => setSubModal({ mode: "create", data: { nameEn: "", nameAr: "" } })}
      />

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <div className="space-y-4">
        {subscriptions.map((sub) => {
          const isOpen = expanded === sub.id;
          return (
            <div key={sub.id} className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden">
              {/* Subscription header */}
              <div className="flex items-center justify-between px-5 py-4">
                <button
                  onClick={() => setExpanded(isOpen ? null : sub.id)}
                  className="flex items-center gap-3 flex-1 text-start"
                >
                  {isOpen ? <HiOutlineChevronUp className="w-4 h-4 text-gray-500" /> : <HiOutlineChevronDown className="w-4 h-4 text-gray-500" />}
                  <span className="font-bold">{lang === "ar" ? sub.nameAr : sub.nameEn}</span>
                  <span className="text-xs text-gray-500">({sub.plans?.length || 0} {t.plans})</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSubModal({ mode: "edit", data: { id: sub.id, nameEn: sub.nameEn, nameAr: sub.nameAr } })}
                    className="p-2 rounded-lg hover:bg-surface-600 text-gray-400 hover:text-white transition-colors"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (window.confirm(t.confirmDelete)) deleteSubMut.mutate(sub.id); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Plans table */}
              {isOpen && (
                <div className="border-t border-surface-600">
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-semibold">{t.plans}</span>
                    <button
                      onClick={() => setPlanModal({
                        mode: "create",
                        subId: sub.id,
                        data: { nameEn: "", nameAr: "", slug: "", price: "", breakfastSlots: "0", mainSlots: "1" },
                      })}
                      className="flex items-center gap-1 text-sm text-brand hover:text-brand-light transition-colors"
                    >
                      <HiOutlinePlus className="w-4 h-4" /> {t.addPlan}
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-surface-600 text-gray-500">
                        <th className="px-5 py-2 text-start">{t.nameEn}</th>
                        <th className="px-5 py-2 text-start">{t.nameAr}</th>
                        <th className="px-5 py-2 text-start">{t.price}</th>
                        <th className="px-5 py-2 text-start">{t.breakfastSlots}</th>
                        <th className="px-5 py-2 text-start">{t.mainSlots}</th>
                        <th className="px-5 py-2 text-end">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(sub.plans || []).sort((a, b) => a.price - b.price).map((plan) => (
                        <tr key={plan.id} className="border-t border-surface-600 hover:bg-surface-700/50">
                          <td className="px-5 py-2">{plan.nameEn}</td>
                          <td className="px-5 py-2">{plan.nameAr}</td>
                          <td className="px-5 py-2 text-brand font-semibold">{plan.price} {t.sar}</td>
                          <td className="px-5 py-2 text-gray-400">{plan.breakfastSlots}</td>
                          <td className="px-5 py-2 text-gray-400">{plan.mainSlots}</td>
                          <td className="px-5 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setPlanModal({
                                  mode: "edit",
                                  subId: sub.id,
                                  data: {
                                    id: plan.id,
                                    nameEn: plan.nameEn,
                                    nameAr: plan.nameAr,
                                    slug: plan.slug,
                                    price: plan.price,
                                    breakfastSlots: plan.breakfastSlots,
                                    mainSlots: plan.mainSlots,
                                  },
                                })}
                                className="p-1.5 rounded-lg hover:bg-surface-600 text-gray-400 hover:text-white transition-colors"
                              >
                                <HiOutlinePencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { if (window.confirm(t.confirmDelete)) deletePlanMut.mutate(plan.id); }}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <HiOutlineTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!sub.plans || sub.plans.length === 0) && (
                    <div className="text-center py-6 text-gray-500 text-sm">{t.noResults}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {subscriptions.length === 0 && (
          <div className="text-center py-10 text-gray-500">{t.noResults}</div>
        )}
      </div>

      {/* Subscription modal */}
      {subModal && (
        <Modal title={subModal.mode === "create" ? t.addSubscription : t.editSubscription} onClose={() => setSubModal(null)}>
          <div className="space-y-4">
            <ModalField label={t.nameEn} value={subModal.data.nameEn} onChange={(v) => setSubModal({ ...subModal, data: { ...subModal.data, nameEn: v } })} />
            <ModalField label={t.nameAr} value={subModal.data.nameAr} onChange={(v) => setSubModal({ ...subModal, data: { ...subModal.data, nameAr: v } })} dir="rtl" />
            <button onClick={handleSubSave} className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-black font-bold text-sm transition-colors">
              {subModal.mode === "create" ? t.create : t.save}
            </button>
          </div>
        </Modal>
      )}

      {/* Plan modal */}
      {planModal && (
        <Modal title={planModal.mode === "create" ? t.addPlan : t.editPlan} onClose={() => setPlanModal(null)}>
          <div className="space-y-4">
            <ModalField label={t.nameEn} value={planModal.data.nameEn} onChange={(v) => setPlanModal({ ...planModal, data: { ...planModal.data, nameEn: v } })} />
            <ModalField label={t.nameAr} value={planModal.data.nameAr} onChange={(v) => setPlanModal({ ...planModal, data: { ...planModal.data, nameAr: v } })} dir="rtl" />
            <ModalField label={t.slug} value={planModal.data.slug} onChange={(v) => setPlanModal({ ...planModal, data: { ...planModal.data, slug: v } })} />
            <ModalField label={t.price} value={planModal.data.price} onChange={(v) => setPlanModal({ ...planModal, data: { ...planModal.data, price: v } })} type="number" />
            <div className="grid grid-cols-2 gap-3">
              <ModalField label={t.breakfastSlots} value={planModal.data.breakfastSlots} onChange={(v) => setPlanModal({ ...planModal, data: { ...planModal.data, breakfastSlots: v } })} type="number" />
              <ModalField label={t.mainSlots} value={planModal.data.mainSlots} onChange={(v) => setPlanModal({ ...planModal, data: { ...planModal.data, mainSlots: v } })} type="number" />
            </div>
            <button onClick={handlePlanSave} className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-black font-bold text-sm transition-colors">
              {planModal.mode === "create" ? t.create : t.save}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-800 border border-surface-600 rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ModalField({ label, value, onChange, type = "text", dir }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        step={type === "number" ? "any" : undefined}
        className="w-full px-4 py-2.5 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
      />
    </div>
  );
}
