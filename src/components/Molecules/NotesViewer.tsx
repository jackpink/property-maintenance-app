import React, { MouseEvent } from "react";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { CTAButton, EditButton, EditIcon } from "../Atoms/Button";
import NotesHistory, { NoteHistory } from "./NotesHistory";
import { ParagraphText } from "../Atoms/Text";
import NotesEditor from "./NotesEditor";
import { EditIconSmall } from "../Atoms/Icons";

type NotesViewerProps = {
  notes: string | null;
  notesLoading: boolean;
  updateNotes: (event: MouseEvent<HTMLButtonElement>) => void;
  editNotesMode: boolean;
  setEditNotesMode: React.Dispatch<React.SetStateAction<boolean>>;
  history?: NoteHistory[];
  historyLoading?: boolean;
  disabled?: boolean;
};

const NotesViewer: React.FC<NotesViewerProps> = ({
  notes,
  notesLoading,
  updateNotes,
  editNotesMode,
  setEditNotesMode,
  history,
  historyLoading,
  disabled = false,
}) => {
  return (
    <div className="grid w-full place-items-center place-self-center px-4 ">
      {notesLoading ? (
        <div className="h-8 w-8">
          <LoadingSpinner />
        </div>
      ) : !notes && !editNotesMode ? (
        <CTAButton onClick={() => setEditNotesMode(true)}>Add Notes</CTAButton>
      ) : (
        <>
          {editNotesMode ? (
            <>
              <NotesEditor
                notes={notes}
                updateNotes={updateNotes}
                setEditNotesMode={setEditNotesMode}
              />
            </>
          ) : (
            <>
              <div className="relative mb-2 h-12 w-full">
                <button
                  className="absolute  right-0"
                  onClick={() => setEditNotesMode(true)}
                  disabled={disabled}
                >
                  <EditIconSmall />
                </button>
              </div>
              <ParagraphText>{notes}</ParagraphText>
            </>
          )}
          <NotesHistory history={history} historyLoading={historyLoading} />
        </>
      )}
    </div>
  );
};

export default NotesViewer;
