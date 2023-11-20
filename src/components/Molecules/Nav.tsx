import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import { HorizontalLogo } from "../Atoms/Logo";
import { Text } from "../Atoms/Text";
import { CTAButton } from "../Atoms/Button";
import { NavMenuButton } from "../Atoms/Button";

const NavItems: React.FC = () => {
  return (
    <>
      <li className="mb-4">
        <Link href="/homeowner" className="hover:text-sky-500 ">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Dashboard
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/about" className="">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            About
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/contact" className="hover:text-sky-500">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Contact
          </Text>
        </Link>
      </li>
    </>
  );
};

const UserItems: React.FC = () => {
  const { user } = useUser();
  return (
    <>
      <SignedIn>
        <li>
          <Text className="text-altSecondary">ACCOUNT</Text>
          <div className="relative h-32 px-6">
            <UserButton afterSignOutUrl="/sign-in" userProfileMode="modal" />
            <Text className="absolute right-0 top-0 text-altSecondary">
              {user?.fullName}
            </Text>

            <Text className="absolute right-0 top-10 text-altSecondary">
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </div>
        </li>
        <li className="flex flex-col">
          <SignOutButton>
            <CTAButton rounded className="self-center">
              Sign Out
            </CTAButton>
          </SignOutButton>
        </li>
      </SignedIn>

      <SignedOut>
        <li className="flex flex-col ">
          <CTAButton rounded className="self-center">
            Sign In
          </CTAButton>
        </li>
        <li className="flex flex-col">
          <CTAButton rounded className="self-center">
            Sign Up
          </CTAButton>
        </li>
      </SignedOut>
    </>
  );
};

type NavPopoverProps = {
  display: string;
  className: string;
};

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="relative flex w-full items-center justify-between px-2 pt-6">
        <Link href="/" className="mr-3  flex-none overflow-hidden md:w-auto">
          <HorizontalLogo height={40} />
        </Link>

        <div className="relative ml-auto hidden items-center sm:flex">
          <nav className="">
            <ul className="flex space-x-8">
              <NavItems />
            </ul>
          </nav>
          <div className="ml-6 flex items-center border-l border-slate-200 pl-6 dark:border-slate-800"></div>
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton userProfileMode="navigation" />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <Link href="/sign-in">
              <CTAButton rounded>Sign In</CTAButton>
            </Link>
          </SignedOut>
        </div>
        <NavMenuButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          className="sm:hidden"
        />
      </div>
      <div
        className={clsx(
          "  w-full rounded-md border-b-2 border-black bg-light p-2 transition-max-height  duration-500 ease-in-out sm:hidden",
          isOpen ? "visible max-h-96" : "invisible max-h-0"
        )}
      >
        <ul className="">
          <NavItems />
          <UserItems />
        </ul>
      </div>
    </>
  );
};

export default Nav;
