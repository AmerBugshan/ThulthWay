import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineTrash } from "react-icons/hi";
import { fetchOrders, fetchSubscriptions, deleteOrder } from "../lib/api";
import useLanguageStore from "../store/useLanguageStore";
import PageHeader from "../components/PageHeader";

const SUB_DURATION_DAYS = 30;

function getDaysLeft(createdAt) {
  const start = new Date(createdAt);
  const end = new Date(start);
  end.setDate(end.getDate() + SUB_DURATION_DAYS);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export default function OrdersPage() {
  const { t, lang } = useLanguageStore();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    subscriptionTypeId: "",
    dateFrom: "",
    dateTo: "",
  });

  const params = { page, limit: 20 };
  if (filters.subscriptionTypeId) params.subscriptionTypeId = filters.subscriptionTypeId;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => fetchOrders(params),
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["admin-subscriptions-filter"],
    queryFn: fetchSubscriptions,
  });

  const removeMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const handleDelete = (id) => {
    if (window.confirm(t.confirmDelete)) {
      removeMutation.mutate(id);
    }
  };

  const orders = data?.orders || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const setFilter = (key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  return (
    <div>
      <PageHeader title={t.orders} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.subscriptionTypeId}
          onChange={setFilter("subscriptionTypeId")}
          className="px-4 py-2 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
        >
          <option value="">{t.all} {t.subscriptions}</option>
          {subscriptions.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {lang === "ar" ? sub.nameAr : sub.nameEn}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t.from}</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={setFilter("dateFrom")}
            className="px-3 py-2 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t.to}</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={setFilter("dateTo")}
            className="px-3 py-2 rounded-xl bg-surface-700 border border-surface-600 text-white text-sm focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-600 text-gray-500">
                  <th className="px-5 py-3 text-start">{t.order}</th>
                  <th className="px-5 py-3 text-start">{t.date}</th>
                  <th className="px-5 py-3 text-start">{t.subscription}</th>
                  <th className="px-5 py-3 text-start">{t.plan}</th>
                  <th className="px-5 py-3 text-start">{t.price}</th>
                  <th className="px-5 py-3 text-start">{t.daysLeft}</th>
                  <th className="px-5 py-3 text-start">{t.totalCalories}</th>
                  <th className="px-5 py-3 text-start">{t.totalProtein}</th>
                  <th className="px-5 py-3 text-end">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const daysLeft = getDaysLeft(order.createdAt);
                  const isActive = daysLeft > 0;
                  return (
                    <tr key={order.id} className="border-b border-surface-600 last:border-0 hover:bg-surface-700/50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-400">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        {lang === "ar" ? order.subscriptionType?.nameAr : order.subscriptionType?.nameEn}
                      </td>
                      <td className="px-5 py-3">
                        {lang === "ar" ? order.plan?.nameAr : order.plan?.nameEn}
                      </td>
                      <td className="px-5 py-3 text-brand font-semibold">
                        {order.plan?.price} {t.sar}
                      </td>
                      <td className="px-5 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">
                            {daysLeft} {daysLeft === 1 ? t.day : t.daysPlural}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400">
                            {t.expired}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-400">{Math.round(order.totalCalories)}</td>
                      <td className="px-5 py-3 text-gray-400">{Math.round(order.totalProtein)}g</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-10 text-gray-500">{t.noResults}</div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold disabled:opacity-40 transition-colors"
              >
                {t.prev}
              </button>
              <span className="text-sm text-gray-400">
                {t.page} {pagination.page} {t.of} {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold disabled:opacity-40 transition-colors"
              >
                {t.next}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
