import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";
import { TextInputWithError } from "../Atoms/TextInput";
import { DayPicker } from "react-day-picker";
import { CTAButton } from "../Atoms/Button";
import { format } from "date-fns";
import Popover from "../Atoms/Popover";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../Atoms/Button";

type PropertyAddJobProps = {
  propertyId: string;
  createJobPopoverOpen: boolean;
  setCreatejobPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PropertyAddJob: React.FC<PropertyAddJobProps> = ({
  propertyId,
  createJobPopoverOpen,
  setCreatejobPopoverOpen,
}) => {
  return (
    <>
      <LargeButton onClick={() => setCreatejobPopoverOpen(true)}>
        <LargeButtonTitle>Add New Job</LargeButtonTitle>
        <LargeButtonContent>
          Create a new Job to be added to this property
        </LargeButtonContent>
      </LargeButton>
      <Popover
        popoveropen={createJobPopoverOpen}
        setPopoverOpen={setCreatejobPopoverOpen}
      >
        <CreateJobForm propertyId={propertyId} />
      </Popover>
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

export default PropertyAddJob;
