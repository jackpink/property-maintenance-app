import { useState } from "react";
import { Dialog } from '@headlessui/react';
import clsx from 'clsx';

type NavPopoverProps = {
    display: string
    className: string
}

const RoomPopover: React.FC<NavPopoverProps> = ({ display = 'md:hidden', className, ...props }) => {
    const [isOpen, setIsOpen] = useState(false)
  
    return (
      <div className={clsx('inline', className, display)} {...props}>
          <button
              type="button"
              className="text-slate-500 w-1/2 h-8 flex items-center justify-center hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              onClick={() => setIsOpen(true)}
          >
              <p className="">Select Room</p>
              <svg width="24" height="24" fill="none" aria-hidden="true">
              <path
                  d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              />
              </svg>
          </button>
          <Dialog
              as="div"
              className={clsx('fixed z-50 inset-0', display)}
              open={isOpen}
              onClose={setIsOpen}
          >
              <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
              <div className="fixed top-1/4 left-0 w-full mr-4 bg-white rounded-lg shadow-lg p-6 text-base font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:highlight-white/5">
              <button
                  type="button"
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  onClick={() => setIsOpen(false)}
              >
                  <span className="sr-only">Close navigation</span>
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible" aria-hidden="true">
                  <path
                      d="M0 0L10 10M10 0L0 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                  />
                  </svg>
              </button>
              <p>Rooms</p>
              
              </div>
          </Dialog>
        </div>
    )}

    export default RoomPopover;