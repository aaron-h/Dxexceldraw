import './Qiuzhi2046Logo.scss';

const Qiuzhi2046LogoIcon = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="Qiuzhi2046Logo-icon"
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

const Qiuzhi2046LogoText = () => (
  <svg
    viewBox="0 0 150 40"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="Qiuzhi2046Logo-text"
  >
    <text
      x="5"
      y="30"
      fontSize="24"
      fontWeight="bold"
      fill="var(--color-primary)"
      fontFamily="'Courier New', monospace"
    >
      秋芝2046
    </text>
  </svg>
);

type LogoSize = "small" | "normal" | "large" | "custom";

interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  style?: React.CSSProperties;
}

export const Qiuzhi2046Logo = ({
  style,
  size = "normal",
  withText = true,
}: LogoProps) => {
  return (
    <div className={`Qiuzhi2046Logo is-${size}`} style={style}>
      <Qiuzhi2046LogoIcon />
      {withText && <Qiuzhi2046LogoText />}
    </div>
  );
};
