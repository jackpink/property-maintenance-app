import { PropsWithChildren } from "react";
import { MainMenuSide, MainMenuBottom } from "../Molecules/MainMenu";

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
      <div className="fixed top-0 hidden h-full w-40 flex-none overflow-hidden border border-r-4  border-altPrimary bg-altSecondary md:block">
        <MainMenuSide />
      </div>
      <div className="h-34 fixed bottom-0 z-40  w-full  overflow-hidden border border-t-4 border-altPrimary bg-altSecondary py-8  md:hidden">
        <MainMenuBottom />
      </div>
      <div className="grow md:pl-40">{children}</div>
    </div>
  );
}
