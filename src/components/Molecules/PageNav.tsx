import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { HorizontalLogo } from "../Atoms/Logo";
import { Text } from "../Atoms/Text";
import { NavMenuButton } from "../Atoms/Button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

const checkPath = (path: string) => {
  const page = path.substring(path.lastIndexOf("/") + 1);

  switch (page) {
    case "rooms":
      return "Rooms";
    case "jobs":
      return "Jobs";
    case "photos":
      return "Photos";
    case "documents":
      return "Documents";
    case "general":
      return "General";
    default:
      return "General" || "Dashboard";
  }
};

type PageNavItemProps = {
  linkHref: string;
  linkText: string;
};

const PageNavItem: React.FC<PageNavItemProps> = ({ linkHref, linkText }) => {
  const page = checkPath(usePathname());
  const isActive = linkText === page;
  return (
    <li className="mb-4">
      <Link href={linkHref} className="hover:text-sky-500 ">
        <Text
          className={clsx(
            "rounded-xl p-3 font-semibold hover:text-brandSecondary",
            isActive && "border-2 border-brandSecondary",
            !isActive && "text-altPrimary"
          )}
          colour={clsx(
            isActive && "text-brandSecondary",
            !isActive && "text-altPrimary"
          )}
        >
          {linkText}
        </Text>
      </Link>
    </li>
  );
};

type PropertyPageNavItemsProps = {
  propertyId: string;
};

const PropertyPageNavItems: React.FC<PropertyPageNavItemsProps> = ({
  propertyId,
}) => {
  return (
    <>
      <PageNavItem linkHref="/homeowner" linkText="Dashboard" />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/rooms`}
        linkText="Rooms"
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/jobs`}
        linkText="Jobs"
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/photos`}
        linkText="Photos"
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/documents`}
        linkText="Documents"
      />
    </>
  );
};

type JobPageNavItemsProps = {
  propertyId: string;
  jobId: string;
};

const JobPageNavItems: React.FC<JobPageNavItemsProps> = ({
  propertyId,
  jobId,
}) => {
  return (
    <>
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}`}
        linkText="General"
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}/rooms`}
        linkText="Rooms"
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}/Documents`}
        linkText="Documents"
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}/Photos`}
        linkText="Photos"
      />
    </>
  );
};

type PropertyPageNavProps = {
  propertyId: string;
};

const PageNav: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="relative flex w-full items-center justify-between px-2 pt-6">
        <div className="relative ml-auto hidden items-center sm:flex">
          <nav className="">
            <ul className="flex space-x-8">{children}</ul>
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
        <ul className="">{children}</ul>
      </div>
    </>
  );
};

export const PropertyPageNav: React.FC<PropertyPageNavProps> = ({
  propertyId,
}) => {
  return (
    <PageNav>
      <PropertyPageNavItems propertyId={propertyId} />
    </PageNav>
  );
};

type JobPageNavProps = {
  propertyId: string;
  jobId: string;
};

export const JobPageNav: React.FC<JobPageNavProps> = ({
  propertyId,
  jobId,
}) => {
  return (
    <PageNav>
      <JobPageNavItems propertyId={propertyId} jobId={jobId} />
    </PageNav>
  );
};
