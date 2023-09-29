import { useState, type PropsWithChildren } from "react";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { type SelectedJobs } from ".";

type NavPopoverProps = {
  selectedJobs: SelectedJobs;
};

const JobPopover: React.FC<PropsWithChildren<NavPopoverProps>> = ({
  selectedJobs,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={clsx("inline")} {...props}>
      <button
        type="button"
        className="flex h-8 items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        onClick={() => setIsOpen(true)}
      >
        <p className="">Select Job</p>

        <svg fill="currentColor" viewBox="0 0 20 20" className="h-8 w-8">
          <path
            x-show="!open"
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
          ></path>
        </svg>
        <p className="rounded border border-teal-800 bg-teal-300 p-2">
          {selectedJobs[0]?.title}
        </p>
      </button>
      <Dialog
        as="div"
        className={clsx("fixed inset-0 z-50")}
        open={isOpen}
        onClose={setIsOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
        <div className="dark:highlight-white/5 fixed left-0 top-1/4 mr-4 w-full rounded-lg bg-white p-6 text-base font-semibold text-slate-900 shadow-lg dark:bg-slate-800 dark:text-slate-400">
          <button
            type="button"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
            onClick={() => setIsOpen(false)}
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
          {props.children}
        </div>
      </Dialog>
    </div>
  );
};

export default JobPopover;
