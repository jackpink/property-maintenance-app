import { PropsWithChildren } from "react";

export const BackgroundContainer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className=" mb-8 w-full justify-center overflow-hidden rounded-3xl bg-secondary pb-4">
      {children}
    </div>
  );
};

export const BackgroundContainerHeader: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <div className=" bg-primary">{children}</div>;
};
