import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProgressBar from "../components/ProgressBar";

export default function OrderLayout() {
  const location = useLocation();

  return (
    <main className="max-w-6xl mx-auto px-4 pb-32">
      <ProgressBar />
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </main>
  );
}
