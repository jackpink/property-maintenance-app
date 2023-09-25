import { useState, type PropsWithChildren } from "react";
import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import { type SelectedRoom } from "./index";

type NavPopoverProps = {
    selectedRoom: SelectedRoom
}

const RoomPopover: React.FC<PropsWithChildren<NavPopoverProps>> = ({ selectedRoom, ...props }) => {
    const [isOpen, setIsOpen] = useState(false)
    console.log(selectedRoom);
    return (
      <div className={clsx('inline')} {...props}>
          <button
              type="button"
              className="text-slate-500 h-8 flex items-center justify-center hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              onClick={() => setIsOpen(true)}
          >
              <p className="">Select Room</p>
             
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8">
                    <path x-show="!open" fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
            </svg>
            <p  className="border rounded border-teal-800 bg-teal-300 p-2" >{selectedRoom.level?.label} &gt; {selectedRoom.room?.label}</p>
          </button>
          <Dialog
              as="div"
              className={clsx('fixed z-50 inset-0')}
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
              {props.children}
              </div>
          </Dialog>
        </div>
    )}

    export default RoomPopover;