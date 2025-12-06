import "./ExcalidrawLogo.scss";

const LogoIcon = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ExcalidrawLogo-icon"
  >
    <rect width="40" height="40" rx="8" fill="var(--color-primary)"/>
    <path
      d="M10 20H15V30H10V20Z"
      fill="white"
    />
    <path
      d="M25 10H30V30H25V10Z"
      fill="white"
    />
    <path
      d="M10 10H20V15H10V10Z"
      fill="white"
    />
  </svg>
);

const LogoText = () => (
  <svg
    viewBox="0 0 120 40"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="ExcalidrawLogo-text"
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

type LogoSize = "xs" | "small" | "normal" | "large" | "custom" | "mobile";

interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  style?: React.CSSProperties;
  /**
   * If true, the logo will not be wrapped in a Link component.
   * The link prop will be ignored as well.
   * It will merely be a plain div.
   */
  isNotLink?: boolean;
}

export const ExcalidrawLogo = ({
  style,
  size = "small",
  withText,
}: LogoProps) => {
  return (
    <div className={`ExcalidrawLogo is-${size}`} style={style}>
      <LogoIcon />
      {withText && <LogoText />}
    </div>
  );
};