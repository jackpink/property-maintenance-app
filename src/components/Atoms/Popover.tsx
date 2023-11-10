import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";

type PopoverProps = {
  popoveropen: boolean;
  setPopoverOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const Popover: React.FC<PopoverProps> = ({
  popoveropen,
  setPopoverOpen,
  children,
}) => {
  return (
    <div className={clsx("inline", !popoveropen && "hidden")}>
      <button
        type="button"
        className="flex h-8 items-center justify-center text-slate-500 hover:text-slate-600 "
        onClick={() => setPopoverOpen(true)}
      ></button>
      <Dialog
        as="div"
        className={clsx("fixed inset-0 z-50")}
        open={popoveropen}
        onClose={setPopoverOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm " />
        <div className="dark:highlight-white/5 fixed left-0 top-1/4 mr-4 w-full rounded-lg bg-white p-6 text-base font-semibold text-slate-900 shadow-lg ">
          <button
            type="button"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-600 "
            onClick={() => setPopoverOpen(false)}
          >
            <span className="sr-only">Close navigation</span>
            <svg
              viewBox="0 0 10 10"
              className="h-2.5 w-2.5 overflow-visible"
              aria-hidden="true"
            >
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {children}
        </div>
      </Dialog>
    </div>
  );
};

export default Popover;
