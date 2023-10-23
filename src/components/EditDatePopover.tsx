import { DayPicker } from "react-day-picker";
import Popover from "./Popover";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

type EditDateProps = {
  currentDate: Date;
  newDate: Date | undefined;
  setNewDate: Dispatch<SetStateAction<Date | undefined>>;
  jobDayPickerOpen: boolean;
  setJobDayPickerOpen: Dispatch<SetStateAction<boolean>>;
};

const EditDatePopover: React.FC<React.PropsWithChildren<EditDateProps>> = ({
  currentDate,
  newDate,
  setNewDate,
  children,
  jobDayPickerOpen,
  setJobDayPickerOpen,
}) => {
  return (
    <>
      <span className="">
        <button
          onClick={() => setJobDayPickerOpen(true)}
          className="rounded-md border-2 border-black p-1"
        >
          {currentDate.toDateString()}
        </button>
      </span>
      <Popover
        popoveropen={jobDayPickerOpen}
        setPopoverOpen={setJobDayPickerOpen}
      >
        <div className="grid place-items-center text-center">
          <p className="block text-sm font-medium text-gray-700">
            Current Date:
            {currentDate ? <> {format(currentDate, "PPP")}</> : <></>}
          </p>
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
