import { PropsWithChildren } from "react";
import MainMenu from "../Molecules/MainMenu";

export function ResponsiveColumns({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-2 gap-4 3xl:gap-8">{children}</div>;
}

export function ColumnOne({ children }: PropsWithChildren) {
  return (
    <div className="col-span-2 mx-4 grid justify-center  3xl:col-span-1">
      {children}
    </div>
  );
}

export function ColumnTwo({ children }: PropsWithChildren) {
  return <div className="col-span-2 mx-4  3xl:col-span-1">{children}</div>;
}

export function PageWithMainMenu({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-nowrap">
      <div className="flex-none border border-r-4 border-altPrimary bg-altSecondary">
        <MainMenu />
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
