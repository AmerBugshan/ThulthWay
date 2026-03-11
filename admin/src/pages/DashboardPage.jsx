import { useQuery } from "@tanstack/react-query";
import { HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineCollection } from "react-icons/hi";
import { fetchStats } from "../lib/api";
import useLanguageStore from "../store/useLanguageStore";

const statCards = [
  { key: "totalOrders", field: "totalOrders", icon: HiOutlineShoppingCart, color: "text-blue-400" },
  { key: "totalRevenue", field: "totalRevenue", icon: HiOutlineCurrencyDollar, color: "text-brand", suffix: "sar" },
  { key: "totalMeals", field: "totalMeals", icon: HiOutlineCube, color: "text-yellow-400" },
  { key: "totalSubs", field: "totalSubscriptionTypes", icon: HiOutlineCollection, color: "text-purple-400" },
];

export default function DashboardPage() {
  const { t, lang } = useLanguageStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchStats("30d"),
  });

  if (isLoading) return <Loading text={t.loading} />;
  if (error) return <div className="text-red-400 py-10 text-center">{t.error}</div>;

  const { summary, popularMeals = [] } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{t.dashboard}</h1>
      <p className="text-gray-500 text-sm mb-8">{t.recentPeriod}</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-surface-800 border border-surface-600 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{t[card.key]}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>
              {summary[card.field]?.toLocaleString() ?? 0}
              {card.suffix && <span className="text-sm font-normal text-gray-500 ms-1">{t[card.suffix]}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Popular meals */}
      <div className="bg-surface-800 border border-surface-600 rounded-2xl p-6">
        <h2 className="font-bold mb-4">{t.popularMeals}</h2>
        {popularMeals.length === 0 ? (
          <p className="text-gray-500 text-sm">{t.noResults}</p>
        ) : (
          <div className="space-y-3">
            {popularMeals.slice(0, 8).map((m, i) => (
              <div key={m.mealId} className="flex items-center justify-between py-2 border-b border-surface-600 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-6">{i + 1}.</span>
                  <span className="font-medium">
                    {lang === "ar" ? m.nameAr : m.nameEn}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-600 text-gray-400">
                    {m.type === "BREAKFAST" ? t.breakfast : t.main}
                  </span>
                </div>
                <span className="text-brand font-semibold">{m.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Loading({ text }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      <span className="ms-3 text-gray-400">{text}</span>
    </div>
  );
}
