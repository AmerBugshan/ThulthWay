import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProgressBar from "./components/ProgressBar";
import StepSubscription from "./components/StepSubscription";
import StepPlan from "./components/StepPlan";
import StepWeek from "./components/StepWeek";
import StepSummary from "./components/StepSummary";
import useOrderStore from "./store/useOrderStore";
import useLanguageStore from "./store/useLanguageStore";

export default function App() {
  const step = useOrderStore((s) => s.step);
  const { lang, isRtl } = useLanguageStore();

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const fontClass = isRtl ? "font-cairo" : "font-inter";

  return (
    <div className={`min-h-screen bg-surface-900 ${fontClass}`}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pb-32">
        <ProgressBar />
        <AnimatePresence mode="wait">
          {step === 1 && <StepSubscription key="step1" />}
          {step === 2 && <StepPlan key="step2" />}
          {step === 3 && <StepWeek key="step3" />}
          {step === 4 && <StepSummary key="step4" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
