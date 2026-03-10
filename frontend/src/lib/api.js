import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// ── Subscriptions ──────────────────────────────────────────
export const fetchSubscriptions = () =>
  api.get("/subscriptions").then((r) => r.data);

// ── Meals ──────────────────────────────────────────────────
export const fetchMeals = (type) =>
  api.get("/meals", { params: type ? { type } : {} }).then((r) => r.data);

export const fetchMealById = (id) =>
  api.get(`/meals/${id}`).then((r) => r.data);

// ── Orders ─────────────────────────────────────────────────
export const createOrder = (payload) =>
  api.post("/orders", payload).then((r) => r.data);

export const fetchOrder = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);

export default api;
