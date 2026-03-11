import { NavLink } from "react-router-dom";
import { HiOutlineHome, HiOutlineCube, HiOutlineTag, HiOutlineCreditCard, HiOutlineClipboardList } from "react-icons/hi";
import useLanguageStore from "../store/useLanguageStore";

const links = [
  { to: "/", icon: HiOutlineHome, key: "dashboard", end: true },
  { to: "/meals", icon: HiOutlineCube, key: "meals" },
  { to: "/categories", icon: HiOutlineTag, key: "categories" },
  { to: "/subscriptions", icon: HiOutlineCreditCard, key: "subscriptions" },
  { to: "/orders", icon: HiOutlineClipboardList, key: "orders" },
];

export default function Sidebar() {
  const { t, toggleLang, isRtl } = useLanguageStore();

  return (
    <aside className="w-56 shrink-0 bg-surface-800 border-e border-surface-600 flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-surface-600">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-black text-sm">
          W
        </div>
        <div>
          <div className={`text-sm font-bold leading-tight ${isRtl ? "font-cairo" : "font-inter"}`}>
            {t.brand}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t.admin}</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-gray-400 hover:text-white hover:bg-surface-700"
              }`
            }
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {t[link.key]}
          </NavLink>
        ))}
      </nav>

      {/* Language toggle */}
      <div className="p-3 border-t border-surface-600">
        <button
          onClick={toggleLang}
          className="w-full px-3 py-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold transition-colors text-center"
        >
          {t.langToggle}
        </button>
      </div>
    </aside>
  );
}
