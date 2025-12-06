import './NToogleLogo.scss';

const NToogleLogoIcon = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="NToogleLogo-icon"
  >
    <rect
      x="5"
      y="5"
      width="30"
      height="30"
      rx="5"
      stroke="var(--color-primary)"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
    />
    <path
      d="M12 20L20 12L28 20"
      stroke="var(--color-primary)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12L20 20L28 12"
      stroke="var(--color-primary)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NToogleLogoText = () => (
  <svg
    viewBox="0 0 120 40"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="NToogleLogo-text"
  >
    <text
      x="5"
      y="30"
      fontSize="24"
      fontWeight="bold"
      fill="var(--color-primary)"
      fontFamily="'Courier New', monospace"
    >
      NToogle
    </text>
  </svg>
);

type LogoSize = "small" | "normal" | "large" | "custom";

interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  style?: React.CSSProperties;
}

export const NToogleLogo = ({
  style,
  size = "normal",
  withText = true,
}: LogoProps) => {
  return (
    <div className={`NToogleLogo is-${size}`} style={style}>
      <NToogleLogoIcon />
      {withText && <NToogleLogoText />}
    </div>
  );
};
