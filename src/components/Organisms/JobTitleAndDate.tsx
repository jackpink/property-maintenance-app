import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
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
import {
  TabAttributeComponent,
  TabAttributeComponentLabel,
  TabAttributeComponentValue,
} from "../Atoms/TabLists";
import { TextInput } from "../Atoms/TextInput";
import { TabListComponentTextField } from "../Molecules/EditableAttributes";

type JobDateProps = {
  date: Date;
  title: string;
  jobId: string;
  disabled?: boolean;
};

export default function JobTitleAndDate({
  date,
  title,
  jobId,
  disabled = false,
}: JobDateProps) {
  const [jobDayPickerOpen, setJobDayPickerOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(date);
  const [newTitle, setNewTitle] = useState(title);
  const ctx = api.useContext();

  const { mutate: updateJob } = api.job.updateJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.job.getJob.invalidate();
      // close popover
    },
    onError: () => {
      toast("Failed to update Trade information for Job");
    },
  });

  const onClickUpdateDate = () => {
    // aysnc update date
    if (!!newDate) updateJob({ jobId: jobId, date: newDate });
    else toast("Could not update date, selected Date error");
  };

  return (
    <>
      <TabListComponentTextField
        label="Title:"
        value={title}
        exists={!!title}
        updateValueFunction={(newTitle: string) => {
          updateJob({ jobId: jobId, title: newTitle });
        }}
      />
      <EditDatePopover
        currentDate={date}
        newDate={newDate}
        setNewDate={setNewDate}
        jobDayPickerOpen={jobDayPickerOpen}
        setJobDayPickerOpen={setJobDayPickerOpen}
        disabled={disabled}
      >
        {!!newDate ? (
          <CTAButton onClick={onClickUpdateDate}>
            Set New Date as {format(newDate, "PPP")}
          </CTAButton>
        ) : (
          <></>
        )}
      </EditDatePopover>
    </>
  );
}
