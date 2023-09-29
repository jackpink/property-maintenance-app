import { ReactNode } from "react";

type LargeButtonProps = {
  LargeButtonTitle: ReactNode;
  LargeButtonContent: ReactNode;
};

export const LargeButton: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/20 p-4 text-teal-800 hover:bg-black/30">
      {children}
    </div>
  );
};

export const LargeButtonTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <h3 className="text-2xl font-bold">{children} →</h3>;
};

export const LargeButtonContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className="text-lg">{children}</div>;
};
