import nopiLogoOrange from '../../assets/nopi-logo-orange.png';

const NopiLogo = ({ className = '', compact = false }) => {
  return (
    <div className={`${className}`}>
      <img
        src={nopiLogoOrange}
        alt="Logo NOPI"
        className={compact ? 'w-[160px] max-w-full object-contain' : 'w-[280px] max-w-full object-contain'}
      />
    </div>
  );
};

export default NopiLogo;
