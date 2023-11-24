import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { concatAddress } from "~/components/Molecules/Properties/Property";
import { CTAButton } from "~/components/Atoms/Button";
import Link from "next/link";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text } from "~/components/Atoms/Text";
import PageNav from "~/components/Molecules/PageNav";
import PropertyRecentJobs from "~/components/Organisms/PropertyRecentJobs";
import PropertyAddJob from "~/components/Organisms/PropertyAddJob";
import { useState } from "react";
import { PropertiesBreadcrumbs } from "~/components/Molecules/Breadcrumbs";
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

export default function HomeownerPropertyPage() {
  const id = useRouter().query.index?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id) return <>loading</>;
  return <HomeownerPropertyPageWithParams propertyId={id} />;
}

type HomeownerPropertyPageWithParamsProps = {
  propertyId: string;
};

const HomeownerPropertyPageWithParams: React.FC<
  HomeownerPropertyPageWithParamsProps
> = ({ propertyId }) => {
  const [createJobPopoverOpen, setCreatejobPopoverOpen] = useState(false);
  const {
    data: property,
    error: propertyFetchError,
    isLoading: propertyIsLoading,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });

  if (!!propertyFetchError) toast("Failed to fetch property");
  const {
    data: recentJobs,
    error: recentJobsFetchError,
    isLoading: recentJobsAreLoading,
  } = api.job.getRecentJobsForProperty.useQuery({
    propertyId: propertyId,
  });

  if (!!propertyFetchError) toast("Failed to fetch property");
  if (!!recentJobsFetchError) toast("Failed to fetch Recent Jobs");
  let address = "";
  if (!!property) address = concatAddress(property);

  return (
    <PageWithMainMenu>
      <PageTitle>{address}</PageTitle>
      <PropertiesBreadcrumbs
        address={address}
        propertyId={propertyId}
        propertyPage="Jobs"
      />
      <PageNav propertyId={propertyId} />
      <ResponsiveColumns>
        <ColumnOne>
          <PropertyAddJob
            propertyId={propertyId}
            createJobPopoverOpen={createJobPopoverOpen}
            setCreatejobPopoverOpen={setCreatejobPopoverOpen}
          />
          {recentJobsAreLoading ? (
            <LoadingSpinner />
          ) : recentJobsFetchError ? (
            <Text>{recentJobsFetchError?.message}</Text>
          ) : recentJobs ? (
            <PropertyRecentJobs
              recentJobs={recentJobs}
              loading={recentJobsAreLoading}
            />
          ) : (
            <Text>Could not load recent jobs for this property.</Text>
          )}
        </ColumnOne>
      </ResponsiveColumns>
    </PageWithMainMenu>
  );
};

const BackToDashboardButton: React.FC = () => {
  return (
    <Link href="/homeowner/">
      <CTAButton className="border-none"> {"< Back to Dashboard"}</CTAButton>
    </Link>
  );
};
