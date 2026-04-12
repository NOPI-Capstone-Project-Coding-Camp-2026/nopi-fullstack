import { Link } from 'react-router-dom';

const ActionCard = ({ title, desc, buttonText, to }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>

      <Link
        to={to}
        className="mt-5 inline-block rounded-xl bg-[#E27C3E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#cf6f36]"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default ActionCard;