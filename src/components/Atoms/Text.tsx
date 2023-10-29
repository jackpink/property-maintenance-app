import clsx from "clsx";

type TextProps = {
  text: string;
  className?: string;
};

export function Text({ text, className }: TextProps) {
  return (
    <p
      className={clsx(
        "text-center font-sans text-lg text-slate-700",
        className
      )}
    >
      {text}
    </p>
  );
}

type TextSpanProps = {
  text: string;
  className?: string;
};

export function TextSpan({ text, className }: TextSpanProps) {
  return (
    <span
      className={clsx(
        "text-center font-sans text-lg text-slate-700",
        className
      )}
    >
      {text}
    </span>
  );
}
