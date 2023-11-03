import clsx from "clsx";
import { PropsWithChildren } from "react";

type PageTitleProps = {
  title: string;
  className?: string;
};

export function PageTitle({ title, className }: PageTitleProps) {
  return (
    <h1
      className={clsx(
        "py-8 text-center font-sans text-4xl font-extrabold text-slate-900",
        className
      )}
    >
      {title}
    </h1>
  );
}

type PageSubTitleProps = {
  className?: string;
};

export function PageSubTitle({
  children,
  className,
}: PropsWithChildren<PageSubTitleProps>) {
  return (
    <h2
      className={clsx(
        "pb-4 text-center font-sans text-3xl font-extrabold text-slate-700",
        className
      )}
    >
      {children}
    </h2>
  );
}
