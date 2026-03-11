import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import MealsPage from "./pages/MealsPage";
import MealFormPage from "./pages/MealFormPage";
import CategoriesPage from "./pages/CategoriesPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import OrdersPage from "./pages/OrdersPage";
import useLanguageStore from "./store/useLanguageStore";

export default function App() {
  const { lang, isRtl } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const fontClass = isRtl ? "font-cairo" : "font-inter";

  return (
    <div className={`min-h-screen bg-surface-900 flex ${fontClass}`}>
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/meals/new" element={<MealFormPage />} />
          <Route path="/meals/:id/edit" element={<MealFormPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}
