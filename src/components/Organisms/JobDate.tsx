import { PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import EditDatePopover from "../Molecules/EditDatePopover";
import { CTAButton } from "../Atoms/Button";
import { format } from "date-fns";
import { PageSubTitle } from "../Atoms/Title";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";

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
      void ctx.job.getJob.invalidate();
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
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle className="">Job Completed On </PageSubTitle>
      </BackgroundContainerHeader>
      <EditDatePopover
        currentDate={date}
        newDate={newDate}
        setNewDate={setNewDate}
        jobDayPickerOpen={jobDayPickerOpen}
        setJobDayPickerOpen={setJobDayPickerOpen}
        disbled={disabled}
      >
        {!!newDate ? (
          <CTAButton onClick={onClickUpdateDate}>
            Set New Date as {format(newDate, "PPP")}
          </CTAButton>
        ) : (
          <></>
        )}
      </EditDatePopover>
    </BackgroundContainer>
  );
}
