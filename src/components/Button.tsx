import clsx from "clsx";
import { type ReactNode } from "react";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  value?: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  value,
}) => {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-teal-800 bg-teal-300 p-2 text-xl font-extrabold text-slate-900",
        className
      )}
    >
      {children}
    </button>
  );
};
export default Button;
