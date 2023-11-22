import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { HorizontalLogo } from "../Atoms/Logo";
import { Text } from "../Atoms/Text";
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
            Rooms
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/contact" className="hover:text-sky-500">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Jobs
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/contact" className="hover:text-sky-500">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Documents
          </Text>
        </Link>
      </li>
      <li className="mb-4">
        <Link href="/contact" className="hover:text-sky-500">
          <Text className="font-semibold text-altPrimary hover:text-brandSecondary">
            Photos
          </Text>
        </Link>
      </li>
    </>
  );
};

const PageNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="relative flex w-full items-center justify-between px-2 pt-6">
        <div className="relative ml-auto hidden items-center sm:flex">
          <nav className="">
            <ul className="flex space-x-8">
              <NavItems />
            </ul>
          </nav>
          <div className="ml-6 flex items-center border-l border-slate-200 pl-6 dark:border-slate-800"></div>
        </div>
        <NavMenuButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          className="sm:hidden"
        />
      </div>
      <div
        className={clsx(
          "  w-full rounded-md border-b-2 border-black bg-light p-2 transition-max-height transition-visibility duration-500 ease-in-out sm:hidden",
          isOpen ? "visible max-h-96" : "invisible max-h-0"
        )}
      >
        <ul className="">
          <NavItems />
        </ul>
      </div>
    </>
  );
};

export default PageNav;
