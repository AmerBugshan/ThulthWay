import { Navigate } from "react-router-dom";
import useOrderStore from "../store/useOrderStore";

const guards = {
  plan: (state) => state.subscriptionType,
  week: (state) => state.plan,
  summary: (state) => {
    const { plan, meals } = state;
    if (!plan) return false;
    const { breakfastSlots, mainSlots } = state.getSlotConfig();
    const slots = [];
    for (let s = 0; s < breakfastSlots; s++) slots.push(0);
    for (let s = 0; s < mainSlots; s++) slots.push(1 + s);
    for (let d = 0; d < 5; d++) {
      for (const slotIndex of slots) {
        if (!meals[d][slotIndex]) return false;
      }
    }
    return true;
  },
};

const redirects = {
  plan: "/order/subscription",
  week: "/order/plan",
  summary: "/order/week",
};

export default function ProtectedRoute({ step, children }) {
  const guard = guards[step];
  if (guard && !guard(useOrderStore.getState())) {
    return <Navigate to={redirects[step]} replace />;
  }
  return children;
}
