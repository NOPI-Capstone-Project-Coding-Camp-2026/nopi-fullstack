const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>

      <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default StatCard;