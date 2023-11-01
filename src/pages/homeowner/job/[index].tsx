import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import JobDate from "~/components/Organisms/JobDate";
import { CTAButton, GhostButton } from "~/components/Atoms/Button";
import Photos from "~/components/JobPhotos";
import React, { useState } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
import ClickAwayListener from "~/components/ClickAwayListener";
import UploadPhotoButton from "~/components/UploadPhoto";
import PropertyHeroWithSelectedRooms from "~/components/Molecules/PropertyHeroWithSelectedRooms";
import { PageTitle } from "~/components/Atoms/Title";
import JobCompletedBy from "~/components/Organisms/JobCompletedBy";
import JobRoomSelector from "~/components/Organisms/JobRoomSelector";
import JobDocuments from "~/components/Organisms/JobDocuments";

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
      <NotesViewer
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

type Notes = Job["notes"];
type TradeNotes = Job["tradeNotes"];

type NoteHistory = {
  notes: string;
  date: Date;
};

type NotesViewerProps = {
  notes: Notes;
  tradeNotes: TradeNotes;
  jobId: string;
  history?: NoteHistory[];
  historyLoading: boolean;
};

const NotesViewer: React.FC<NotesViewerProps> = ({
  notes,
  tradeNotes,
  jobId,
  history,
  historyLoading,
}) => {
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState(notes || "");
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [selectedHomeownerHistory, setSelectedHomeownerHistory] = useState<
    undefined | string
  >();

  const ctx = api.useContext();

  const { mutate: createNote } = api.job.updateNotesForJob.useMutation({
    onSuccess: () => {
      setAddNoteOpen(false);
      void ctx.job.getJobForHomeowner.invalidate();
    },
    onError: () => {
      toast("Could Not Add Notes");
    },
  });

  const onClickAddNotes = () => {
    console.log("new Note", newNote);
    createNote({ jobId: jobId, notes: newNote });
  };
  console.log(notes);
  return (
    <div className="grid place-items-center place-self-center px-4 md:w-128">
      {!!notes && (
        <>
          <div className="mb-2 grid ">
            <p className="place-self-start text-base text-blue-900">
              HOMEOWNER
            </p>
            <GhostButton>Edit</GhostButton>
          </div>
          <div className="whitespace-pre-line px-4 text-base text-blue-900">
            {notes}
          </div>
          <GhostButton onClick={() => setViewHistoryOpen(true)}>
            View History
          </GhostButton>
          {viewHistoryOpen && (
            <select
              className="place-self-end text-center	text-blue-900"
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
      )}

      {!!tradeNotes && (
        <>
          <p className="mb-2 text-base text-green-800">TRADE</p>
          <div className="w-96 whitespace-pre-line text-base text-green-800">
            {tradeNotes}
          </div>
        </>
      )}
      {addNoteOpen ? (
        <ClickAwayListener clickOutsideAction={() => setAddNoteOpen(false)}>
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
            <CTAButton onClick={onClickAddNotes}>+</CTAButton>
          </div>
        </ClickAwayListener>
      ) : (
        <CTAButton onClick={() => setAddNoteOpen(true)}>Add Note</CTAButton>
      )}
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
