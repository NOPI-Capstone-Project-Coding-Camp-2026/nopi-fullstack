const NopiLogo = ({ className = '', compact = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 68 68" className="h-12 w-12 text-[#f08a2a]" fill="none" aria-hidden="true">
        <path
          d="M18 12h22a6 6 0 0 1 6 6v28a2 2 0 0 1-3.2 1.6L38 44l-4.8 3.6A2 2 0 0 1 30 46V18a2 2 0 0 0-2-2H18"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 18h18v38H12a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 27h8M17 35h8M17 43h5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>

      <div className="leading-none">
        <div className="text-[3rem] font-semibold tracking-[-0.08em] text-[#f08a2a]">NOPI</div>
        {!compact && <div className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-[#f2a463]">Bisnis Makin Lancar</div>}
      </div>
    </div>
  );
};

export default NopiLogo;
