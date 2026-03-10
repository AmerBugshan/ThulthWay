import { create } from "zustand";
import translations from "../lib/i18n";

const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;

const useLanguageStore = create((set, get) => ({
  lang: saved || "en",
  t: translations[saved || "en"],
  isRtl: (saved || "en") === "ar",

  toggleLang: () => {
    const next = get().lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
    set({ lang: next, t: translations[next], isRtl: next === "ar" });
  },

  setLang: (lang) => {
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    set({ lang, t: translations[lang], isRtl: lang === "ar" });
  },
}));

export default useLanguageStore;
