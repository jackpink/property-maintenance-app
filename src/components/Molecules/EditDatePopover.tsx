import { DayPicker } from "react-day-picker";
import Popover from "../Popover";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import { Text } from "../Atoms/Text";
import { FormattedDate } from "~/utils/utits";
import clsx from "clsx";

type EditDateProps = {
  currentDate: Date;
  newDate: Date | undefined;
  setNewDate: Dispatch<SetStateAction<Date | undefined>>;
  jobDayPickerOpen: boolean;
  setJobDayPickerOpen: Dispatch<SetStateAction<boolean>>;
  disbled?: boolean;
};

const EditDatePopover: React.FC<React.PropsWithChildren<EditDateProps>> = ({
  currentDate,
  newDate,
  setNewDate,
  children,
  jobDayPickerOpen,
  setJobDayPickerOpen,
  disbled = false,
}) => {
  return (
    <>
      <span className="">
        <button
          onClick={() => setJobDayPickerOpen(true)}
          className={clsx(
            "rounded-md border-2 border-black p-1",
            disbled && "cursor-not-allowed opacity-50"
          )}
        >
          {currentDate.toDateString()}
        </button>
      </span>
      <Popover
        popoveropen={jobDayPickerOpen}
        setPopoverOpen={setJobDayPickerOpen}
      >
        <div className="grid place-items-center text-center">
          <Text
            text={"Current Date: " + FormattedDate(currentDate)}
            className="block text-sm font-medium"
          />
          <DayPicker
            mode="single"
            required
            selected={newDate}
            onSelect={setNewDate}
          />

          {children}
        </div>
      </Popover>
    </>
  );
};

export default EditDatePopover;
