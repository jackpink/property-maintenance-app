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
import { PageSubTitle, PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text } from "~/components/Atoms/Text";
import { PropertyPageNav } from "~/components/Molecules/PageNav";
import PropertyRecentJobs from "~/components/Organisms/PropertyRecentJobs";
import PropertyAddJob from "~/components/Organisms/PropertyAddJob";
import { useState } from "react";
import { PropertiesBreadcrumbs } from "~/components/Molecules/Breadcrumbs";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import RoomSelectorPopover from "~/components/Molecules/RoomSelector";
import { ro } from "date-fns/locale";
import JobsSearchTool from "~/components/Organisms/JobsSearchTool";
import PhotosSearchTool from "~/components/Organisms/PhotosSearchTool";
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

export default function HomeownerPropertyPage() {
  const id = useRouter().query.property?.toString();

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
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);
  const [roomSelectorError, setRoomSelectorError] = useState(false);
  const {
    data: property,
    error: propertyFetchError,
    isLoading: propertyIsLoading,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });

  if (!!propertyFetchError) toast("Failed to fetch property");
  let address = "";
  if (!!property) address = concatAddress(property);

  return (
    <PageWithMainMenu>
      <PropertiesBreadcrumbs
        address={address}
        propertyId={propertyId}
        propertyPage="Jobs"
      />
      <PageTitle>{address}</PageTitle>

      <PropertyPageNav propertyId={propertyId} />

      <div className="w-full">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex justify-center py-8"></div>
          <BackgroundContainer>
            <BackgroundContainerHeader>
              <PageSubTitle>Search Photos</PageSubTitle>
            </BackgroundContainerHeader>
            {propertyIsLoading ? (
              <LoadingSpinner />
            ) : propertyFetchError ? (
              <Text>{propertyFetchError?.message}</Text>
            ) : property ? (
              <PhotosSearchTool property={property} />
            ) : (
              <Text>Could not load property.</Text>
            )}
          </BackgroundContainer>
        </div>
      </div>
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
