import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { concatAddress } from "~/components/Molecules/Properties/Property";
import EditProperty from "~/components/Organisms/EditProperty";
import RecentJobsViewer from "~/components/Molecules/RecentJobsViewer";
import { CTAButton } from "~/components/Atoms/Button";
import Popover from "~/components/Atoms/Popover";
import { useState } from "react";
import clsx from "clsx";
import z from "zod";
import "react-day-picker/dist/style.css";
// build the property page
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

const ValidJobInput = z
  .string()
  .min(5, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

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
    api.job.createJobForPropertyByTrade.useMutation({
      onSuccess: ({ job }) => {
        // Redirect to new Job route
        console.log("redirect to job/", job.id);
        void router.push("/trade/beta/job/" + job.id);
      },
    });

  const addJobClickEvent = () => {
    // Check The Room input for correctness
    const checkAddJobInput = ValidJobInput.safeParse(jobTitleInput);
    if (!checkAddJobInput.success) {
      console.log("throw error on input");
      const errorFormatted = checkAddJobInput.error.format()._errors.pop();
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
      <label className="block text-sm font-medium text-gray-700">
        {" "}
        Enter Job Title{" "}
      </label>
      <input
        onChange={(e) => setJobTitleInput(e.target.value)}
        disabled={isCreatingJob}
        className={clsx(
          "w-3/4 transform rounded rounded-lg border border-transparent bg-gray-50 p-2 text-base font-extrabold text-neutral-600 text-slate-900 placeholder-gray-300 ring-2 ring-white ring-offset-2 ring-offset-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none md:w-96",
          { "border border-2 border-red-500": error }
        )}
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

type TradePropertyPageWithParamsProps = {
  propertyId: string;
};

const TradePropertyPageWithParams: React.FC<
  TradePropertyPageWithParamsProps
> = ({ propertyId }) => {
  const [createJobPopoverOpen, setCreatejobPopoverOpen] = useState(false);

  const property = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });
  const recentJobs = api.job.getRecentJobsForPropertyByTradeUser.useQuery({
    propertyId: propertyId,
  });
  if (!property.data || !recentJobs.data) return <>Loading</>;

  const address = concatAddress(property.data);

  return (
    <div className="grid grid-cols-1">
      <h1 className="py-8 text-center font-sans text-4xl font-extrabold text-slate-900">
        {address}
      </h1>

      <EditProperty property={property.data} />
      <div className="mb-8 border-b-2 border-black pb-8"></div>
      <div className="w-9/12 place-self-center md:w-8/12 lg:w-7/12 xl:w-128">
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Recents Jobs
        </h2>
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
          <CreateJobForm propertyId={property.data.id} />
        </Popover>
        <RecentJobsViewer recentJobs={recentJobs.data} />
      </div>
    </div>
  );
};

const TradePropertyPage = () => {
  const id = useRouter().query.index?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id) return <>loading</>;
  return <TradePropertyPageWithParams propertyId={id} />;
};

export default TradePropertyPage;
