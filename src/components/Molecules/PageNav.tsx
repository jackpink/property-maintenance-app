import Link from "next/link";
import {
  ReactElement,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";
import clsx from "clsx";
import { HorizontalLogo } from "../Atoms/Logo";
import { Text } from "../Atoms/Text";
import { NavMenuButton } from "../Atoms/Button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { type } from "os";

const checkPath = (path: string) => {
  const page = path.substring(path.lastIndexOf("/") + 1);

  switch (page) {
    case "rooms":
      return "ROOMS";
    case "jobs":
      return "JOBS";
    case "photos":
      return "PHOTOS";
    case "documents":
      return "DOCUMENTS";
    case "general":
      return "GENERAL";
    case "products":
      return "PRODUCTS";
    case "alerts":
      return "ALERTS";
    default:
      return "GENERAL" || "DASHBOARD";
  }
};

type PageNavItemProps = {
  linkHref: string;
  linkText: string;
  onlySelected?: boolean;
};

const PageNavItem: React.FC<PageNavItemProps> = ({
  linkHref,
  linkText,
  onlySelected,
}) => {
  const page = checkPath(usePathname());
  const isActive = linkText === page;
  return (
    <li className={clsx("mb-4 w-40", onlySelected && !isActive && "hidden")}>
      <Link href={linkHref} className="hover:text-sky-500 ">
        <Text
          className={clsx(
            "rounded-xl p-3 font-semibold hover:text-brandSecondary",
            isActive && "border-b-4 border-brandSecondary",
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
  onlySelected?: boolean;
};

const PropertyPageNavItems: React.FC<PropertyPageNavItemsProps> = ({
  propertyId,
  onlySelected = false,
}) => {
  return (
    <>
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}`}
        linkText="GENERAL"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/rooms`}
        linkText="ROOMS"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/jobs`}
        linkText="JOBS"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/photos`}
        linkText="PHOTOS"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(propertyId)}/documents`}
        linkText="DOCUMENTS"
        onlySelected={onlySelected}
      />
    </>
  );
};

type JobPageNavItemsProps = {
  propertyId: string;
  jobId?: string;
  onlySelected?: boolean;
};

const JobPageNavItems: React.FC<JobPageNavItemsProps> = ({
  propertyId,
  jobId = "1",
  onlySelected = false,
}) => {
  return (
    <>
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}`}
        linkText="GENERAL"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}/rooms`}
        linkText="ROOMS"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}/documents`}
        linkText="DOCUMENTS"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/jobs/${encodeURIComponent(jobId)}/photos`}
        linkText="PHOTOS"
        onlySelected={onlySelected}
      />
    </>
  );
};

type RoomPageNavItemsProps = {
  propertyId: string;
  roomId?: string;
  onlySelected?: boolean;
};

const RoomPageNavItems: React.FC<RoomPageNavItemsProps> = ({
  propertyId,
  roomId = "1",
  onlySelected = false,
}) => {
  return (
    <>
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/rooms/${encodeURIComponent(roomId)}`}
        linkText="GENERAL"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/rooms/${encodeURIComponent(roomId)}/products`}
        linkText="PRODUCTS"
        onlySelected={onlySelected}
      />
      <PageNavItem
        linkHref={`/property/${encodeURIComponent(
          propertyId
        )}/rooms/${encodeURIComponent(roomId)}/alerts`}
        linkText="ALERTS"
        onlySelected={onlySelected}
      />
    </>
  );
};

const PageNav = ({
  PageNavItems,
  propertyId,
  jobId,
  roomId,
}: {
  PageNavItems: React.FC<JobPageNavItemsProps | RoomPageNavItemsProps>;
  propertyId: string;
  jobId?: string;
  roomId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative flex w-full  px-2 pt-6">
        <div className="relative hidden items-center lg:flex">
          <nav className="">
            <ul className="flex space-x-8">
              <PageNavItems
                propertyId={propertyId}
                jobId={jobId}
                roomId={roomId}
              />
            </ul>
          </nav>
          <div className="ml-6 flex items-center border-l border-slate-200 pl-6 dark:border-slate-800"></div>
        </div>
        <NavMenuButton
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          className="lg:hidden"
        />

        <ul className={clsx("mx-auto lg:hidden", isOpen && "hidden")}>
          <PageNavItems
            propertyId={propertyId}
            jobId={jobId}
            onlySelected={true}
            roomId={roomId}
          />
        </ul>
      </div>
      <div
        className={clsx(
          "w-full rounded-md border-b-2 border-black bg-light p-2 transition-max-height transition-visibility duration-500 ease-in-out lg:hidden",
          isOpen ? "visible max-h-96" : "invisible max-h-0"
        )}
      >
        <ul className="mx-auto w-40">
          <PageNavItems propertyId={propertyId} jobId={jobId} />
        </ul>
      </div>
    </>
  );
};

type PropertyPageNavProps = {
  propertyId: string;
};

export const PropertyPageNav: React.FC<PropertyPageNavProps> = ({
  propertyId,
}) => {
  const OnlySelectedContext = createContext(false);
  return (
    <PageNav PageNavItems={PropertyPageNavItems} propertyId={propertyId} />
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
    <PageNav
      PageNavItems={JobPageNavItems}
      propertyId={propertyId}
      jobId={jobId}
    />
  );
};

type RoomPageNavProps = {
  propertyId: string;
  roomId: string;
};

export const RoomPageNav: React.FC<RoomPageNavProps> = ({
  propertyId,
  roomId,
}) => {
  return (
    <PageNav
      PageNavItems={RoomPageNavItems}
      propertyId={propertyId}
      roomId={roomId}
    />
  );
};
