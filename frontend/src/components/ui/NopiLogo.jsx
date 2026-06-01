import nopiLogoOrange from '../../assets/nopi-logo-orange.png';

const NopiLogo = ({ className = '', compact = false }) => {
  return (
    <div className={`${className}`}>
      <img
        src={nopiLogoOrange}
        alt="Logo NOPI"
        className={compact ? 'h-12 w-auto object-contain' : 'h-16 w-auto object-contain'}
      />
    </div>
  );
};

export default NopiLogo;
