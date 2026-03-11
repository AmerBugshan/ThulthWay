import { create } from "zustand";
import translations from "../lib/i18n";

const saved = typeof window !== "undefined" ? localStorage.getItem("admin-lang") : null;

const useLanguageStore = create((set, get) => ({
  lang: saved || "en",
  t: translations[saved || "en"],
  isRtl: (saved || "en") === "ar",

  toggleLang: () => {
    const next = get().lang === "en" ? "ar" : "en";
    localStorage.setItem("admin-lang", next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
    set({ lang: next, t: translations[next], isRtl: next === "ar" });
  },
}));

export default useLanguageStore;
