import Link from "next/link";
import { Text } from "../Atoms/Text";

interface IBreadcrumb {
  href: string;
  text: string;
}

type BreadcrumbsProps = {
  breadcrumbs: IBreadcrumb[];
};

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

const RightArrow = ({
  height = 15,
  colour = "#0A5B5A", //#f7ece1",
}: {
  height?: number;
  colour?: string;
}) => (
  <svg
    width={height}
    zoomAndPan="magnify"
    viewBox="0 0 29.108002 29.297031"
    height={height}
    preserveAspectRatio="xMidYMid"
    version="1.0"
    id="svg2"
  >
    <defs id="defs1">
      <clipPath id="a6c68e75e3">
        <path
          d="M 96.410156,72.121094 H 242.66016 V 222.12109 H 96.410156 Z m 0,0"
          clipRule="nonzero"
          id="path1"
        />
      </clipPath>
    </defs>
    <g
      clipPath="url(#a6c68e75e3)"
      id="g2"
      transform="matrix(0.19911416,0,0,0.19531864,-19.199738,-14.087357)"
    >
      <path
        fill={colour}
        d="M 97.035156,72.125 242.61328,146.47266 96.425781,222.125 c 23.550779,-41.46484 42.476559,-84.61719 0.609375,-150 z m 0,0"
        fillOpacity="1"
        fillRule="nonzero"
        id="path2"
      />
    </g>
  </svg>
);
