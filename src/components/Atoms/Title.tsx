import clsx from "clsx";

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
  subtitle: string;
  className?: string;
};

export function PageSubTitle({ subtitle, className }: PageSubTitleProps) {
  return (
    <h2
      className={clsx(
        "pb-4 text-center font-sans text-3xl font-extrabold text-slate-700",
        className
      )}
    >
      {subtitle}
    </h2>
  );
}
