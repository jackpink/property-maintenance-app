import LoadingSpinner from "../Atoms/LoadingSpinner";
import DateTimeDropdown from "../Atoms/DateTimeDropdown";
import { NoteHistory } from "./NotesHistory";

type JobDateTimeDropdownProps = {
  history?: NoteHistory[];
  historyLoading?: boolean;
  selectedHomeownerHistory?: string;
  setSelectedHomeownerHistory: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

const JobDateTimeDropdown: React.FC<JobDateTimeDropdownProps> = ({
  history,
  historyLoading,
  selectedHomeownerHistory,
  setSelectedHomeownerHistory,
}) => {
  return (
    <>
      {historyLoading ? (
        <div className="h-8 w-8">
          <LoadingSpinner />
        </div>
      ) : !!history ? (
        <DateTimeDropdown
          dates={history}
          selectedValue={selectedHomeownerHistory}
          setSelectedValue={setSelectedHomeownerHistory}
        />
      ) : (
        <>Could not load History</>
      )}
    </>
  );
};

export default JobDateTimeDropdown;
