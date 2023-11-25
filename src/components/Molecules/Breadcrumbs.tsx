import Link from "next/link";
import { type } from "os";

interface IBreadcrumb {
  href: string;
  text: string;
}

type BreadcrumbsProps = {
  breadcrumbs: IBreadcrumb[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div className="flex flex-row gap-2 px-8 pt-10">
      {breadcrumbs.map((breadcrumb) => (
        <>
          <span>/</span>
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
  return <Link href={breadcrumb.href}>{breadcrumb.text}</Link>;
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
