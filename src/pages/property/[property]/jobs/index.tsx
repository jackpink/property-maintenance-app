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
      <PropertiesBreadcrumbs
        address={address}
        propertyId={propertyId}
        propertyPage="Jobs"
      />
      <PageTitle>{address}</PageTitle>

      <PropertyPageNav propertyId={propertyId} />
      <ResponsiveColumns>
        <ColumnOne>
          <div className="grid  gap-4">
            <PropertyAddJob
              propertyId={propertyId}
              createJobPopoverOpen={createJobPopoverOpen}
              setCreatejobPopoverOpen={setCreatejobPopoverOpen}
            />
            <BackgroundContainer>
              <BackgroundContainerHeader>
                <PageSubTitle>Search Jobs</PageSubTitle>
              </BackgroundContainerHeader>
              <div className="p-6">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                  <input
                    type="search"
                    className="b relative m-0 -mr-0.5 flex-auto rounded-l border border-solid border-dark bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(13,148,136)] focus:outline-none dark:border-teal-600 dark:text-teal-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                    placeholder="Search by job title"
                    onChange={() => console.log("searching")}
                  />

                  <button
                    className="relative z-[2] flex items-center rounded-r border border-solid border-dark bg-brand px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg"
                    type="button"
                    id="button-addon1"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="#000000"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {propertyIsLoading ? (
                  <LoadingSpinner />
                ) : propertyFetchError ? (
                  <Text>{propertyFetchError?.message}</Text>
                ) : property ? (
                  <RoomSelectorPopover
                    property={property}
                    jobLoading={false}
                    loading={false}
                    setLoading={() => console.log("loading")}
                    onClickRoomAdd={() => console.log("add")}
                    onClickRoomRemove={() => console.log("remove")}
                    checkRoomSelected={() => false}
                    error={roomSelectorError}
                    setError={setRoomSelectorError}
                    roomSelectorOpen={roomSelectorOpen}
                    setRoomSelectorOpen={setRoomSelectorOpen}
                    errorMessage=""
                  >
                    <CTAButton>Select Room</CTAButton>
                  </RoomSelectorPopover>
                ) : (
                  <Text>Could not load recent jobs for this property.</Text>
                )}
              </div>
            </BackgroundContainer>
          </div>
        </ColumnOne>
        <ColumnTwo>
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
        </ColumnTwo>
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
