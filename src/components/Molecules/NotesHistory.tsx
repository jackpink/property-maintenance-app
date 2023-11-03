import { useState } from "react";
import { GhostButton } from "../Atoms/Button";
import { ParagraphText } from "../Atoms/Text";
import NotesHistoryDateTimeDropdown from "./NotesHistoryDateTimeDropdown";

export type NoteHistory = {
  notes: string;
  date: Date;
};

type NotesHistoryProps = {
  history?: NoteHistory[];
  historyLoading?: boolean;
};

const NotesHistory: React.FC<NotesHistoryProps> = ({
  history,
  historyLoading,
}) => {
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [selectedHomeownerHistory, setSelectedHomeownerHistory] = useState<
    undefined | string
  >(history ? (history[0] ? history[0].notes : "") : "");

  return (
    <>
      {viewHistoryOpen ? (
        <>
          <GhostButton
            onClick={() => setViewHistoryOpen(false)}
            className="mb-4"
          >
            Close History
          </GhostButton>
          <NotesHistoryDateTimeDropdown
            history={history}
            historyLoading={historyLoading}
            selectedHomeownerHistory={selectedHomeownerHistory}
            setSelectedHomeownerHistory={setSelectedHomeownerHistory}
          />
          <ParagraphText className="pt-6 text-green-700">
            {selectedHomeownerHistory}
          </ParagraphText>
        </>
      ) : (
        <GhostButton onClick={() => setViewHistoryOpen(true)}>
          View History
        </GhostButton>
      )}
    </>
  );
};

export default NotesHistory;
