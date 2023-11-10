import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { HorizontalLogo } from "../Atoms/Logo";
import { Text } from "../Atoms/Text";

const NavItems: React.FC = () => {
  return (
    <>
      <li>
        <Link
          href="/homeowner"
          className="hover:text-sky-500 dark:hover:text-sky-400"
        >
          <Text className="text-altPrimary">Dashboard</Text>
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          className="hover:text-sky-500 dark:hover:text-sky-400"
        >
          <Text className="text-altPrimary">About</Text>
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          className="hover:text-sky-500 dark:hover:text-sky-400"
        >
          <Text className="text-altPrimary">Contact</Text>
        </Link>
      </li>
    </>
  );
};

type NavPopoverProps = {
  display: string;
  className: string;
};

const NavPopover: React.FC<NavPopoverProps> = ({
  display = "md:hidden",
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx("inline", className, display)} {...props}>
      <div className="felx-nowrap flex">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
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
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <SignInButton />
        </SignedOut>
      </div>
      <Dialog
        as="div"
        className={clsx("fixed inset-0 z-50", display)}
        open={isOpen}
        onClose={setIsOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
        <div className="dark:highlight-white/5 fixed right-4 top-4 w-full max-w-xs rounded-lg bg-white p-6 text-base font-semibold text-slate-900 shadow-lg dark:bg-slate-800 dark:text-slate-400">
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
          <ul className="space-y-6">
            <NavItems />
          </ul>
        </div>
      </Dialog>
    </div>
  );
};

const Nav: React.FC = () => {
  return (
    <>
      <div className="relative flex w-full items-center justify-between px-2 pt-6">
        <Link href="/" className="mr-3  flex-none overflow-hidden md:w-auto">
          <HorizontalLogo height={40} />
        </Link>

        <div className="relative ml-auto hidden items-center sm:flex">
          <nav className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            <ul className="flex space-x-8">
              <NavItems />
            </ul>
          </nav>
          <div className="ml-6 flex items-center border-l border-slate-200 pl-6 dark:border-slate-800"></div>
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <SignInButton />
          </SignedOut>
        </div>
        <NavPopover className="-my-1 ml-2" display="sm:hidden" />
      </div>
    </>
  );
};

export default Nav;
