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
  PageWithSingleColumn,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageSubTitle, PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text } from "~/components/Atoms/Text";
import { PropertyPageNav, RoomPageNav } from "~/components/Molecules/PageNav";
import PropertyRecentJobs from "~/components/Organisms/PropertyRecentJobs";
import PropertyAddJob from "~/components/Organisms/PropertyAddJob";
import { useState } from "react";
import {
  PropertiesBreadcrumbs,
  RoomBreadcrumbs,
} from "~/components/Molecules/Breadcrumbs";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import RoomSelectorPopover from "~/components/Molecules/RoomSelector";
import { ro } from "date-fns/locale";
import JobsSearchTool from "~/components/Organisms/JobsSearchTool";
import RoomAddProduct from "~/components/Organisms/RoomAddProduct";
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

export default function RoomProductPage() {
  const propertyId = useRouter().query.property?.toString();
  const roomId = useRouter().query.room?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!roomId || !propertyId) return <>loading</>;
  return <RoomProductPageWithParams propertyId={propertyId} roomId={roomId} />;
}

type RoomProductPageWithParamsProps = {
  propertyId: string;
  roomId: string;
};

const RoomProductPageWithParams: React.FC<RoomProductPageWithParamsProps> = ({
  propertyId,
  roomId,
}) => {
  const [createProductPopoverOpen, setCreateProductPopoverOpen] =
    useState(false);
  const {
    data: property,
    error: propertyFetchError,
    isLoading: propertyIsLoading,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });

  if (!!propertyFetchError) toast("Failed to fetch property");
  const {
    data: room,
    error: roomError,
    isLoading: roomLoading,
  } = api.property.getRoom.useQuery({
    id: roomId,
  });

  if (!!propertyFetchError) toast("Failed to fetch property");
  if (!!roomError) toast("Failed to fetch Recent Jobs");
  let address = "";
  if (!!property) address = concatAddress(property);

  return (
    <PageWithMainMenu>
      <RoomBreadcrumbs
        address={address}
        propertyId={propertyId}
        roomId={roomId}
        roomLabel={room?.label ?? ""}
      />
      <PageTitle>{room?.label}</PageTitle>

      <RoomPageNav propertyId={propertyId} roomId={roomId} />

      <PageWithSingleColumn>
        <div className="mx-auto flex justify-center py-8">
          <RoomAddProduct
            roomId={roomId}
            createProductPopoverOpen={createProductPopoverOpen}
            setCreateProductPopoverOpen={setCreateProductPopoverOpen}
          />
        </div>
        <BackgroundContainer>
          {propertyIsLoading ? (
            <LoadingSpinner />
          ) : propertyFetchError ? (
            <Text>{propertyFetchError?.message}</Text>
          ) : property ? null : (
            <Text>Could not load property.</Text>
          )}
        </BackgroundContainer>
      </PageWithSingleColumn>
    </PageWithMainMenu>
  );
};
