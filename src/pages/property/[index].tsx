import { RouterOutputs, api } from "~/utils/api";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { concatAddress } from "~/components/Properties/Property";
import EditProperty from "~/components/Organisms/EditProperty";
import { CTAButton } from "~/components/Atoms/Button";
import Popover from "~/components/Atoms/Popover";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import clsx from "clsx";
import z from "zod";
import Link from "next/link";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "~/components/LargeButton";
import { TextInputWithError } from "~/components/Atoms/TextInput";
import {
  ColumnOne,
  ColumnTwo,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageSubTitle, PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text } from "~/components/Atoms/Text";
import {
  PropertyWithLevelAndRooms,
  RoomSelector,
} from "~/components/Molecules/RoomSelector";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import PropertyDocuments from "~/components/Organisms/PropertyDocuments";
import PropertyRecentJobs from "~/components/Organisms/PropertyRecentJobs";
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
              <p className="px-12 pb-4 text-center text-lg text-slate-700">
                {propertyFetchError?.message}
              </p>
              <Link href="/homeowner/">
                <CTAButton className="border-none">
                  {" "}
                  {"< Back to Dashboard"}
                </CTAButton>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href={"/homeowner/search/" + property.id}
                className="mb-6 grid place-items-center"
              >
                <LargeButton>
                  <LargeButtonTitle>Search</LargeButtonTitle>
                  <LargeButtonContent>
                    Search Photos of the property by room and job
                  </LargeButtonContent>
                </LargeButton>
              </Link>
              <CTAButton
                onClick={() => setCreatejobPopoverOpen(true)}
                className="mb-8 place-self-center"
              >
                Add New Job
              </CTAButton>
              <Popover
                popoveropen={createJobPopoverOpen}
                setPopoverOpen={setCreatejobPopoverOpen}
              >
                <CreateJobForm propertyId={propertyId} />
              </Popover>
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

type PropertyRoomSelectorProps = {
  property: PropertyWithLevelAndRooms;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (roomId: string) => boolean;
  selectedRoom: string;
};

const PropertyRoomSelector: React.FC<PropertyRoomSelectorProps> = ({
  property,
  loading,
  setLoading,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
  selectedRoom,
}) => {
  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Rooms</PageSubTitle>
      </BackgroundContainerHeader>
      <RoomSelector
        property={property}
        onClickRoomAdd={onClickRoomAdd}
        onClickRoomRemove={onClickRoomRemove}
        loading={loading}
        setLoading={setLoading}
        checkRoomSelected={(roomId) => roomId === selectedRoom}
      />
    </BackgroundContainer>
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

const ValidJobInput = z
  .string()
  .min(2, { message: "Must be 2 or more characters long" })
  .max(50, { message: "Must be less than 50 characters" });

type CreateJobFormProps = {
  propertyId: string;
};

const CreateJobForm: React.FC<CreateJobFormProps> = ({ propertyId }) => {
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const router = useRouter();

  const { mutate: createJob, isLoading: isCreatingJob } =
    api.job.createJobForPropertyByHomeowner.useMutation({
      onSuccess: ({ job }) => {
        // Redirect to new Job route
        console.log("redirect to job/", job.id);
        void router.push("/homeowner/job/" + job.id);
      },
    });

  const addJobClickEvent = () => {
    // Check The Room input for correctness
    const checkAddJobInput = ValidJobInput.safeParse(jobTitleInput);
    if (!checkAddJobInput.success) {
      const errorFormatted = checkAddJobInput.error.format()._errors.pop();
      console.log("throw error on input", errorFormatted);
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
    } else if (!!date) {
      console.log("add job", jobTitleInput);
      createJob({
        title: jobTitleInput,
        propertyId: propertyId,
        date: date,
      });
    }
  };

  return (
    <div className="grid justify-items-center">
      <TextInputWithError
        label="Enter Job Title"
        value={jobTitleInput}
        onChange={(e) => setJobTitleInput(e.target.value)}
        error={error}
        errorMessage={errorMessage}
        disabled={isCreatingJob}
      />

      <label className="block text-sm font-medium text-gray-700">
        {" "}
        Job Date
      </label>
      {date ? (
        <p className="p-2 font-extrabold text-slate-900 ">
          {format(date, "PPP")}
        </p>
      ) : null}

      <DayPicker mode="single" required selected={date} onSelect={setDate} />

      <CTAButton onClick={addJobClickEvent}>Create Job</CTAButton>
    </div>
  );
};
