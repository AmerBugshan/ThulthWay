export default function NutritionBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
