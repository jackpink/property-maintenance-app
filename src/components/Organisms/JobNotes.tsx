import { useState } from "react";
import { toast } from "sonner";
import { RouterOutputs, api } from "~/utils/api";
import { MouseEvent } from "react";
import NotesViewer from "../Molecules/NotesViewer";
import { NoteHistory } from "../Molecules/NotesHistory";

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type Notes = Job["notes"];
type TradeNotes = Job["tradeNotes"];

type JobNotesProps = {
  notes: Notes;
  tradeNotes: TradeNotes;
  jobId: string;
  history?: NoteHistory[];
  historyLoading: boolean;
};

const JobNotes: React.FC<JobNotesProps> = ({
  notes,
  jobId,
  history,
  historyLoading,
}) => {
  const [editNotesMode, setEditNotesMode] = useState(false);

  const ctx = api.useContext();

  const { mutate: createNote } = api.job.updateNotesForJob.useMutation({
    onSuccess: () => {
      void ctx.job.getJobForHomeowner.invalidate();
      setEditNotesMode(false);
    },
    onError: () => {
      toast("Could Not Add Notes");
    },
  });

  const onClickUpdateNotes = (event: MouseEvent<HTMLButtonElement>) => {
    console.log("new notes", event.currentTarget.value);
    createNote({
      jobId: jobId,
      notes: event.currentTarget.value,
    });
  };
  return (
    <div className="grid w-full place-items-center place-self-center px-4 md:w-128">
      <>
        <NotesViewer
          notes={notes}
          notesLoading={false}
          updateNotes={onClickUpdateNotes}
          editNotesMode={editNotesMode}
          setEditNotesMode={setEditNotesMode}
          history={history}
          historyLoading={historyLoading}
        />
      </>
    </div>
  );
};

export default JobNotes;
