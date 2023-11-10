import clsx from "clsx";
import { PropsWithChildren } from "react";

type TextProps = {
  className?: string;
};

export function Text({
  className,
  children,
}: React.PropsWithChildren<TextProps>) {
  return (
    <p
      className={clsx(
        "--font-geist-sans text-center font-sans text-lg text-dark",
        className
      )}
    >
      {children}
    </p>
  );
}

type TextSpanProps = {
  className?: string;
};

export function TextSpan({
  className,
  children,
}: React.PropsWithChildren<TextSpanProps>) {
  return (
    <span
      className={clsx("text-center font-sans text-lg text-dark", className)}
    >
      {children}
    </span>
  );
}

export function ErrorMessage({
  error,
  errorMessage,
}: {
  error: boolean;
  errorMessage: string | null;
}) {
  return (
    <>{error ? <p className="text-red-500">⚠️ {errorMessage}</p> : <></>}</>
  );
}

type ParagraphTextProps = {
  className?: string;
};

export const ParagraphText: React.FC<PropsWithChildren<ParagraphTextProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        "whitespace-pre-line px-4 text-base text-slate-700",
        className
      )}
    >
      {children}
    </div>
  );
};
