import { ReactNode } from "react";

interface LotusBackgroundProps {
  children: ReactNode;
  className?: string;
}

const LotusBackground = ({ children, className = "" }: LotusBackgroundProps) => {
  return <div className={`lotus-pattern ${className}`}>{children}</div>;
};

export default LotusBackground;
