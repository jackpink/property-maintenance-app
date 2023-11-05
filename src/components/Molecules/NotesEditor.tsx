import clsx from "clsx";
import ClickAwayListener from "../Atoms/ClickAwayListener";
import { MouseEvent, useState } from "react";
import { CTAButton, PlusIcon } from "../Atoms/Button";

type NotesEditorProps = {
  notes: string | null;
  updateNotes: (event: MouseEvent<HTMLButtonElement>) => void;
  setEditNotesMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotesEditor: React.FC<NotesEditorProps> = ({
  notes,
  updateNotes,
  setEditNotesMode,
}) => {
  const [newNote, setNewNote] = useState(notes || "");
  return (
    <ClickAwayListener clickOutsideAction={() => setEditNotesMode(false)}>
      <div className={clsx("flex")}>
        <textarea
          onChange={(e) => setNewNote(e.target.value)}
          value={newNote}
          cols={60}
          rows={3}
          className={clsx(
            "border-1 w-full border border-slate-400 p-2 font-extrabold text-slate-900 outline-none",
            { "border border-2 border-red-500": false }
          )}
        ></textarea>
        <CTAButton value={newNote} onClick={updateNotes}>
          <PlusIcon />
        </CTAButton>
      </div>
    </ClickAwayListener>
  );
};

export default NotesEditor;
