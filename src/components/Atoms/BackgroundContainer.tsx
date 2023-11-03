import { PropsWithChildren } from "react";

export const BackgroundContainer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className=" mb-4 justify-center overflow-hidden rounded-3xl bg-emerald-200">
      {children}
    </div>
  );
};

export const BackgroundContainerHeader: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <div className="bg-emerald-300">{children}</div>;
};
