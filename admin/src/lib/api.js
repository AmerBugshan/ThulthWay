import axios from "axios";

const api = axios.create({ baseURL: "/api/admin" });

// ── Dashboard ──
export const fetchStats = (period = "30d") =>
  api.get(`/dashboard/stats?period=${period}`).then((r) => r.data);

// ── Meals ──
export const fetchMeals = () => api.get("/meals").then((r) => r.data);

export const createMeal = (formData) =>
  api.post("/meals", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const updateMeal = (id, formData) =>
  api.put(`/meals/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

export const deleteMeal = (id) => api.delete(`/meals/${id}`).then((r) => r.data);

// ── Categories ──
export const fetchCategories = () => api.get("/categories").then((r) => r.data);
export const createCategory = (data) => api.post("/categories", data).then((r) => r.data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

// ── Subscriptions ──
export const fetchSubscriptions = () => api.get("/subscriptions").then((r) => r.data);
export const createSubscription = (data) => api.post("/subscriptions", data).then((r) => r.data);
export const updateSubscription = (id, data) => api.put(`/subscriptions/${id}`, data).then((r) => r.data);
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`).then((r) => r.data);

// ── Plans ──
export const createPlan = (subId, data) => api.post(`/subscriptions/${subId}/plans`, data).then((r) => r.data);
export const updatePlan = (id, data) => api.put(`/plans/${id}`, data).then((r) => r.data);
export const deletePlan = (id) => api.delete(`/plans/${id}`).then((r) => r.data);

// ── Orders ──
export const fetchOrders = (params = {}) =>
  api.get("/orders", { params }).then((r) => r.data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`).then((r) => r.data);
