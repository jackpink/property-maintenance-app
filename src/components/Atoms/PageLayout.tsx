import { PropsWithChildren } from "react";

export function ResponsiveColumns({ children }: PropsWithChildren<{}>) {
  return <div className="grid grid-cols-2 gap-4 3xl:gap-8">{children}</div>;
}

export function ColumnOne({ children }: PropsWithChildren<{}>) {
  return (
    <div className="col-span-2 mx-4 grid justify-center md:w-128 3xl:col-span-1">
      {children}
    </div>
  );
}

export function ColumnTwo({ children }: PropsWithChildren<{}>) {
  return (
    <div className="col-span-2 mx-4 md:w-128 3xl:col-span-1">{children}</div>
  );
}
