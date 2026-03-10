import useLanguageStore from "../store/useLanguageStore";

export default function Navbar() {
  const { t, toggleLang, isRtl } = useLanguageStore();

  return (
    <nav className="sticky top-0 z-50 bg-surface-800/90 backdrop-blur-md border-b border-surface-600">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center font-bold text-black text-lg">
            W
          </div>
          <span className={`text-xl font-bold ${isRtl ? "font-cairo" : "font-inter"}`}>
            {t.brand}
          </span>
        </div>
        <button
          onClick={toggleLang}
          className="px-4 py-1.5 rounded-full bg-surface-600 hover:bg-surface-500 text-sm font-semibold transition-colors"
        >
          {t.langToggle}
        </button>
      </div>
    </nav>
  );
}
