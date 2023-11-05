import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { concatAddress } from "~/components/Properties/Property";
import EditProperty from "~/components/Organisms/EditProperty";
import { CTAButton } from "~/components/Atoms/Button";
import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "~/components/Atoms/Button";
import {
  ColumnOne,
  ColumnTwo,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text } from "~/components/Atoms/Text";
import PropertyDocuments from "~/components/Organisms/PropertyDocuments";
import PropertyRecentJobs from "~/components/Organisms/PropertyRecentJobs";
import PropertyRoomSelector from "~/components/Organisms/PropertyRoomSelector";
import PropertyAddJob from "~/components/Organisms/PropertyAddJob";
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
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    data: property,
    error: propertyFetchError,
    isFetching: propertyIsLoading,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });
  const {
    data: recentJobs,
    error: recentJobsFetchError,
    isFetching: recentJobsAreLoading,
  } = api.job.getRecentJobsForProperty.useQuery({
    propertyId: propertyId,
  });

  const router = useRouter();

  if (!!propertyFetchError) toast("Failed to fetch property");
  if (!!recentJobsFetchError) toast("Failed to fetch Recent Jobs");
  let address = "";
  if (!!property) address = concatAddress(property);

  const onClickRoomAdd = (roomId: string) => {
    setSelectedRoom(roomId);
    setLoading(false);
  };

  const onClickRoomRemove = (roomId: string) => {
    setSelectedRoom("");
    setLoading(false);
  };

  return (
    <>
      <PageTitle>{address}</PageTitle>
      <ResponsiveColumns>
        <ColumnOne>
          {propertyIsLoading && (
            <div className="h-30 w-30">
              <LoadingSpinner />
            </div>
          )}

          {!property ? (
            <div className="grid place-items-center">
              <Text>{propertyFetchError?.message}</Text>
              <BackToDashboardButton />
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                <PropertyPhotoSearchButton propertyId={property.id} />
                <PropertyAddJob
                  propertyId={property.id}
                  createJobPopoverOpen={createJobPopoverOpen}
                  setCreatejobPopoverOpen={setCreatejobPopoverOpen}
                />
              </div>
              <PropertyRoomSelector
                property={property}
                loading={loading}
                setLoading={setLoading}
                onClickRoomAdd={onClickRoomAdd}
                onClickRoomRemove={onClickRoomRemove}
                checkRoomSelected={(roomId) => roomId === selectedRoom}
                selectedRoom={selectedRoom}
              />
              <PropertyDocuments propertyId={property.id} />
              {recentJobsAreLoading && <LoadingSpinner />}
              {recentJobs ? (
                <PropertyRecentJobs
                  recentJobs={recentJobs}
                  loading={recentJobsAreLoading}
                  fetchErrormessage={recentJobsFetchError?.message}
                />
              ) : (
                <Text>Could not load recent jobs for this property.</Text>
              )}
            </>
          )}
        </ColumnOne>
        <ColumnTwo>
          {propertyIsLoading && (
            <div className="h-30 w-30">
              <LoadingSpinner />
            </div>
          )}
          {!!property ? (
            <EditProperty property={property} />
          ) : (
            <>
              <Text>Could Not Load Property</Text>
            </>
          )}
        </ColumnTwo>
      </ResponsiveColumns>
    </>
  );
};

// Async component not currently in use, could have potential though
type AsyncComponentProps = {
  Component: ReactNode;
  loading: boolean;
  loadingMessage: string;
  error: boolean;
  errorMessage: string | null;
};

const AsyncComponent: React.FC<AsyncComponentProps> = ({
  Component,
  loading,
  loadingMessage,
  error,
  errorMessage,
}) => {
  return (
    <>
      {loading ? (
        <p className="px-12 pb-4 text-center text-lg text-slate-700">
          Loading {loadingMessage}
        </p>
      ) : error ? (
        <p className="px-12 pb-4 text-center text-lg text-slate-700">
          {errorMessage}
        </p>
      ) : (
        { Component }
      )}
    </>
  );
};

type PropertyPhotoSearchButtonProps = {
  propertyId: string;
};

const PropertyPhotoSearchButton: React.FC<PropertyPhotoSearchButtonProps> = ({
  propertyId,
}) => {
  return (
    <Link href={"/homeowner/search/" + propertyId} className="">
      <LargeButton>
        <LargeButtonTitle>Search</LargeButtonTitle>
        <LargeButtonContent>
          Search Photos of the property by room and job
        </LargeButtonContent>
      </LargeButton>
    </Link>
  );
};

const BackToDashboardButton: React.FC = () => {
  return (
    <Link href="/homeowner/">
      <CTAButton className="border-none"> {"< Back to Dashboard"}</CTAButton>
    </Link>
  );
};
