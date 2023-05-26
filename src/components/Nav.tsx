import Link from "next/link";
import { useState } from "react";
import { Dialog } from '@headlessui/react'
import clsx from 'clsx';
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function NavItems() {
  return (
    <>
      <li>
        <Link href="/trades" className="hover:text-sky-500 dark:hover:text-sky-400">
          Trades
        </Link>
      </li>
      <li>
        <Link href="/about" className="hover:text-sky-500 dark:hover:text-sky-400">
          About
        </Link>
      </li>
      <li>
        <Link href="/contact" className="hover:text-sky-500 dark:hover:text-sky-400">
          Contact
        </Link>
      </li>
    </>
  )
}

type NavPopoverProps = {
    display: string
    className: string
}

export function NavPopover({ display = 'md:hidden', className, ...props }: NavPopoverProps) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <div className={clsx('inline', className, display)} {...props}>
        <button
            type="button"
            className="text-slate-500 w-8 h-8 flex items-center justify-center hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
            onClick={() => setIsOpen(true)}
        >
            <span className="sr-only">Navigation</span>
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
        <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
        </SignedIn>
        <SignedOut>
            {/* Signed out users get sign in button */}
            <SignInButton />
        </SignedOut>
        <Dialog
            as="div"
            className={clsx('fixed z-50 inset-0', display)}
            open={isOpen}
            onClose={setIsOpen}
        >
            <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
            <div className="fixed top-4 right-4 w-full max-w-xs bg-white rounded-lg shadow-lg p-6 text-base font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:highlight-white/5">
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
            <ul className="space-y-6">
                <NavItems />
                
            </ul>
            
            </div>
        </Dialog>
        
    </div>
  )
}


const Nav: React.FC = () => {
    const hasNav = true;

    return(
         <>
               
            <div className="relative flex items-center justify-between w-full pt-6 px-2">
                <Link
                    href="/"
                    className="mr-3 flex-none w-[2.0625rem] overflow-hidden md:w-auto"
                >
                    <span className="sr-only">Tailwind CSS home page</span>
                    <p>Logo</p>
                </Link>
            
                <div className="relative hidden lg:flex items-center ml-auto">
                    
                    <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
                    <ul className="flex space-x-8">
                        <NavItems />
                    </ul>
                    </nav>
                    <div className="flex items-center border-l border-slate-200 ml-6 pl-6 dark:border-slate-800">
                    </div>
                    <SignedIn>
                        {/* Mount the UserButton component */}
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        {/* Signed out users get sign in button */}
                        <SignInButton />
                    </SignedOut>
                </div>
                <NavPopover className="ml-2 -my-1" display="lg:hidden" />
                
                
                
            </div>
           
               
            </>
    )
};

export default Nav;