import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import OrderLayout from "./pages/OrderLayout";
import StepSubscription from "./components/StepSubscription";
import StepPlan from "./components/StepPlan";
import StepWeek from "./components/StepWeek";
import StepSummary from "./components/StepSummary";
import useLanguageStore from "./store/useLanguageStore";

export default function App() {
  const { lang, isRtl } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const fontClass = isRtl ? "font-cairo" : "font-inter";

  return (
    <div className={`min-h-screen bg-surface-900 ${fontClass}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/order" element={<OrderLayout />}>
          <Route path="subscription" element={<StepSubscription />} />
          <Route
            path="plan"
            element={
              <ProtectedRoute step="plan">
                <StepPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="week"
            element={
              <ProtectedRoute step="week">
                <StepWeek />
              </ProtectedRoute>
            }
          />
          <Route
            path="summary"
            element={
              <ProtectedRoute step="summary">
                <StepSummary />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}
