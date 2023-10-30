import clsx from "clsx";
import { type ReactNode } from "react";
import { Text } from "./Text";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
};

export const CTAButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  value,
  disabled,
  loading,
}) => {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-teal-800 bg-teal-300 p-2 text-xl font-extrabold text-slate-900",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait"
      )}
    >
      {children}
    </button>
  );
};

export function GhostButton({
  onClick,
  children,
  className,
  value,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-teal-800 bg-transparent p-2 text-slate-900",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait"
      )}
    >
      <Text>{children}</Text>
    </button>
  );
}
