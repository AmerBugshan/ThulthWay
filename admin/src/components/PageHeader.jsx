import { useNavigate } from "react-router-dom";

export default function PageHeader({ title, actionLabel, actionTo, onAction }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (actionTo) navigate(actionTo);
    else if (onAction) onAction();
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      {(actionLabel) && (
        <button
          onClick={handleClick}
          className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-black text-sm font-bold transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
