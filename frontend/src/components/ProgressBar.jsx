import { useLocation } from "react-router-dom";
import useLanguageStore from "../store/useLanguageStore";

const stepKeys = ["step1Title", "step2Title", "step3Title", "step4Title"];
const pathToStep = {
  "/order/subscription": 1,
  "/order/plan": 2,
  "/order/week": 3,
  "/order/summary": 4,
};

export default function ProgressBar() {
  const location = useLocation();
  const step = pathToStep[location.pathname] || 1;
  const { t } = useLanguageStore();

  return (
    <div className="py-8">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {stepKeys.map((key, i) => {
          const num = i + 1;
          const active = step >= num;
          const current = step === num;
          return (
            <div key={key} className="flex flex-col items-center relative flex-1">
              {i > 0 && (
                <div
                  className={`absolute top-4 -translate-y-1/2 h-0.5 w-full ${
                    step > i ? "bg-brand" : "bg-surface-600"
                  }`}
                  style={{ right: "50%", width: "100%" }}
                />
              )}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  current
                    ? "bg-brand text-black scale-110"
                    : active
                    ? "bg-brand/30 text-brand"
                    : "bg-surface-600 text-gray-500"
                }`}
              >
                {num}
              </div>
              <span
                className={`mt-2 text-xs hidden sm:block ${
                  current ? "text-brand font-semibold" : "text-gray-500"
                }`}
              >
                {t[key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
