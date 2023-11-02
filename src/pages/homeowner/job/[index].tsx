import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import JobDate from "~/components/Organisms/JobDate";
import { CTAButton, GhostButton, PlusIcon } from "~/components/Atoms/Button";
import Photos from "~/components/JobPhotos";
import React, { MouseEvent, PropsWithChildren, useState } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { EditButton } from "~/components/Atoms/Button";
import ClickAwayListener from "~/components/ClickAwayListener";
import UploadPhotoButton from "~/components/UploadPhoto";
import PropertyHeroWithSelectedRooms from "~/components/Molecules/PropertyHeroWithSelectedRooms";
import { PageTitle } from "~/components/Atoms/Title";
import JobCompletedBy from "~/components/Organisms/JobCompletedBy";
import JobRoomSelector from "~/components/Organisms/JobRoomSelector";
import JobDocuments from "~/components/Organisms/JobDocuments";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";

export default function HomeownerJobPage() {
  const id = useRouter().query.index?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id) return <>loading</>;

  return <HomeownerJobPageWithParams id={id} />;
}

type HomeownerJobPageWithParamsProps = {
  id: string;
};

const HomeownerJobPageWithParams: React.FC<HomeownerJobPageWithParamsProps> = ({
  id,
}) => {
  const job = api.job.getJobForHomeowner.useQuery({ jobId: id });
  const history = api.job.getHistoryForJob.useQuery({ jobId: id });

  console.log(history.data);

  const jobLoading = job.isFetching || job.isLoading;

  const historyLoading = history.isFetching || history.isLoading;

  if (!job.data) return <>Loading</>;
  // have some logic here, if has trade user, then display without any action buttons
  return (
    <HomeownerJobPageWithJob
      job={job.data}
      jobLoading={jobLoading}
      history={history.data}
      historyLoading={historyLoading}
    />
  );
};

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type HomeownerJobPageWithJobProps = {
  job: Job;
  jobLoading: boolean;
  history: RouterOutputs["job"]["getHistoryForJob"] | undefined;
  historyLoading: boolean;
};

const HomeownerJobPageWithJob: React.FC<HomeownerJobPageWithJobProps> = ({
  job,
  jobLoading,
  history,
  historyLoading,
}) => {
  const ctx = api.useContext();

  const refetchPhotosAfterUpload = () => {
    void ctx.photo.getPhotosForJobAndRoom.invalidate();
    void ctx.photo.getUnassignedPhotosForJob.invalidate();
  };

  return (
    <div className="grid justify-center">
      <PageTitle title={job.title} />
      <JobDate date={job.date} jobId={job.id} />
      <JobCompletedBy tradeInfo={job.nonUserTradeInfo} jobId={job.id} />

      <PropertyHeroWithSelectedRooms
        Property={job.Property}
        rooms={job.rooms}
      />
      <JobRoomSelector job={job} jobLoading={jobLoading} />
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Documents
      </h2>
      <JobDocuments job={job} />
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Notes
      </h2>
      <JobNotesViewer
        notes={job.notes}
        tradeNotes={job.tradeNotes}
        jobId={job.id}
        history={history?.homeownerNotes}
        historyLoading={historyLoading}
      />
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Photos
      </h2>
      <UploadPhotoButton
        jobId={job.id}
        propertyId={job.Property.id}
        multipleUploads={true}
        refetchPageData={refetchPhotosAfterUpload}
        userType="HOMEOWNER"
      />
      <PhotoViewer job={job} />
    </div>
  );
};

type ParagraphTextProps = {
  className?: string;
};

const ParagraphText: React.FC<PropsWithChildren<ParagraphTextProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        "whitespace-pre-line px-4 text-base text-slate-700",
        className
      )}
    >
      {children}
    </div>
  );
};

type DateTimeDropdownProps = {
  history?: NoteHistory[];
  historyLoading?: boolean;
  selectedHomeownerHistory?: string;
  setSelectedHomeownerHistory: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

const DateTimeDropdown: React.FC<DateTimeDropdownProps> = ({
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
      ) : (
        <select
          className="border-1	rounded-md border border-black p-1 text-center text-green-700"
          value={selectedHomeownerHistory}
          onChange={(e) => setSelectedHomeownerHistory(e.target.value)}
        >
          {!!history &&
            history.map((history, index) => (
              <option key={index} value={history.notes}>
                {format(history.date, "PPPppp")}
              </option>
            ))}
        </select>
      )}
    </>
  );
};

type NotesViewerProps = {
  notes: string | null;
  notesLoading: boolean;
  updateNotes: (event: MouseEvent<HTMLButtonElement>) => void;
  editNotesMode: boolean;
  setEditNotesMode: React.Dispatch<React.SetStateAction<boolean>>;
  history?: NoteHistory[];
  historyLoading?: boolean;
};

const NotesViewer: React.FC<NotesViewerProps> = ({
  notes,
  notesLoading,
  updateNotes,
  editNotesMode,
  setEditNotesMode,
  history,
  historyLoading,
}) => {
  return (
    <div className="grid place-items-center place-self-center px-4 md:w-128">
      {notesLoading ? (
        <div className="h-8 w-8">
          <LoadingSpinner />
        </div>
      ) : !notes ? (
        <>Add</>
      ) : (
        <>
          {editNotesMode && !!notes ? (
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
                <EditButton onClick={() => setEditNotesMode(true)} />
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

type NotesEditorProps = {
  notes: string;
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
  >();

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
          <DateTimeDropdown
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

type Notes = Job["notes"];
type TradeNotes = Job["tradeNotes"];

type NoteHistory = {
  notes: string;
  date: Date;
};

type JobNotesViewerProps = {
  notes: Notes;
  tradeNotes: TradeNotes;
  jobId: string;
  history?: NoteHistory[];
  historyLoading: boolean;
};

const JobNotesViewer: React.FC<JobNotesViewerProps> = ({
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
    <div className="grid place-items-center place-self-center px-4 md:w-128">
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

type PhotoViewerProps = {
  job: Job;
};

const PhotoViewer: React.FC<PhotoViewerProps> = ({ job }) => {
  const [selectedRoom, setSelectedRoom] = useState("UNASSIGNED");
  return (
    <div className="text-center	">
      <select
        className="rounded-full border-2 border-solid border-black p-3 text-center	"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
      >
        <option value="UNASSIGNED">UNASSIGNED</option>
        {job.rooms.map((room, index) => {
          return (
            <option key={index} value={room.id}>
              {room.Level.label.toUpperCase() + "→" + room.label.toUpperCase()}
            </option>
          );
        })}
      </select>
      {selectedRoom === "UNASSIGNED" ? (
        <UnassignedPhotos job={job} />
      ) : (
        <RoomPhotos job={job} roomId={selectedRoom} />
      )}
    </div>
  );
};

type UnassignedPhotosProps = {
  job: Job;
};

const UnassignedPhotos: React.FC<UnassignedPhotosProps> = ({ job }) => {
  const { data: photos } = api.photo.getUnassignedPhotosForJob.useQuery({
    jobId: job.id,
  });

  if (!!photos && photos.length > 0) {
    console.log(photos);
    return (
      <div>
        <Photos photos={photos} rooms={job.rooms} />
      </div>
    );
  }
  return <p>no photo</p>;
};

type RoomPhotosProps = {
  job: Job;
  roomId: string;
};

const RoomPhotos: React.FC<RoomPhotosProps> = ({ job, roomId }) => {
  const { data: photos } = api.photo.getPhotosForJobAndRoom.useQuery({
    jobId: job.id,
    roomId: roomId,
  });

  if (!!photos && photos.length > 0) {
    console.log(photos);
    return (
      <>
        <Photos photos={photos} rooms={job.rooms} />
      </>
    );
  }
  return <p>no photos</p>;
};
