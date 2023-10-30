import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { TextSpan } from "../Atoms/Text";
import EditDatePopover from "../Molecules/EditDatePopover";
import Button from "../Atoms/Button";
import { format } from "date-fns";

type JobDateProps = {
  date: Date;
  jobId: string;
  disabled?: boolean;
};

export default function JobDate({
  date,
  jobId,
  disabled = false,
}: JobDateProps) {
  const [jobDayPickerOpen, setJobDayPickerOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(date);

  const ctx = api.useContext();

  const { mutate: updateDate } = api.job.updateDateForJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.job.getJobForHomeowner.invalidate();
      // close popover
      setJobDayPickerOpen(false);
    },
    onError: () => {
      toast("Failed to update Date for Job");
    },
  });

  const onClickUpdateDate = () => {
    // aysnc update date
    if (!!newDate) updateDate({ jobId: jobId, date: newDate });
    else toast("Could not update date, selected Date error");
  };

  return (
    <div className="mb-4 flex justify-center">
      <TextSpan text="Job Completed On: " className="place-self-center px-12" />

      <EditDatePopover
        currentDate={date}
        newDate={newDate}
        setNewDate={setNewDate}
        jobDayPickerOpen={jobDayPickerOpen}
        setJobDayPickerOpen={setJobDayPickerOpen}
        disbled={disabled}
      >
        {!!newDate ? (
          <Button onClick={onClickUpdateDate}>
            Set New Date as {format(newDate, "PPP")}
          </Button>
        ) : (
          <></>
        )}
      </EditDatePopover>
    </div>
  );
}
