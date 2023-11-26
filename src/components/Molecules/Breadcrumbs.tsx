import Link from "next/link";
import { Text } from "../Atoms/Text";

interface IBreadcrumb {
  href: string;
  text: string;
}

type BreadcrumbsProps = {
  breadcrumbs: IBreadcrumb[];
};
const RightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-black/50"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      className="text-black/50"
      d="M10 3a.5.5 0 01.5.5v12a.5.5 0 01-1 0v-12A.5.5 0 0110 3z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      className="text-black/50"
      d="M6.646 7.854a.5.5 0 010 .708l-2.5 2.5a.5.5 0 01-.708-.708L5.293 8 3.438 6.146a.5.5 0 11.708-.708l2.5 2.5z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      className="text-black/50"
      d="M16.354 7.854a.5.5 0 000 .708l2.5 2.5a.5.5 0 00.708-.708L17.707 8l1.854-1.854a.5.5 0 10-.708-.708l-2.5 2.5z"
      clipRule="evenodd"
    />
  </svg>
);

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div className="flex flex-row gap-2 bg-altSecondary px-8 py-6">
      {breadcrumbs.map((breadcrumb) => (
        <>
          <span>
            <RightArrow />
          </span>
          <Breadcrumb breadcrumb={breadcrumb} />
        </>
      ))}
    </div>
  );
};

type BreadcrumbProps = {
  breadcrumb: IBreadcrumb;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumb }) => {
  return (
    <Link href={breadcrumb.href}>
      <Text colour="text-altPrimary hover:text-black/50 ">
        {breadcrumb.text}
      </Text>
    </Link>
  );
};

type PropertiesBreadcrumbsProps = {
  address?: string | undefined;
  propertyId?: string | undefined;
  propertyPage?: string;
};

export const PropertiesBreadcrumbs: React.FC<PropertiesBreadcrumbsProps> = ({
  address,
  propertyId,
  propertyPage,
}) => {
  console.log(address, propertyId, propertyPage);
  const breadcrumbs =
    address && propertyId && propertyPage
      ? [
          { href: "/properties", text: "Properties" },
          {
            href: `/property/${encodeURIComponent(propertyId)}`,
            text: address,
          },
          {
            href: `/property/${encodeURIComponent(propertyId)}/${propertyPage}`,
            text: propertyPage,
          },
        ]
      : propertyId && address
      ? [
          { href: "/properties", text: "Properties" },
          {
            href: `/property/${encodeURIComponent(propertyId)}`,
            text: address,
          },
        ]
      : [{ href: "/properties", text: "Properties" }];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

type JobBreadcrumbsProps = {
  address: string;
  propertyId: string;
  jobTitle: string;
  jobId: string;
};

export const JobBreadcrumbs: React.FC<JobBreadcrumbsProps> = ({
  address,
  propertyId,
  jobId,
  jobTitle,
}) => {
  const breadcrumbs = [
    { href: "/properties", text: "Properties" },
    {
      href: `/property/${encodeURIComponent(propertyId)}`,
      text: address,
    },
    {
      href: `/property/${encodeURIComponent(propertyId)}/jobs`,
      text: "Jobs",
    },
    {
      href: `/property/${encodeURIComponent(
        propertyId
      )}/jobs/${encodeURIComponent(jobId)}`,
      text: jobTitle,
    },
  ];
  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};
