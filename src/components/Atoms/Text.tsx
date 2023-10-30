import clsx from "clsx";

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
        "text-center font-sans text-lg text-slate-700",
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
      className={clsx(
        "text-center font-sans text-lg text-slate-700",
        className
      )}
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
