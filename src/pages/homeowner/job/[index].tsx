import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";

import Button from "~/components/Button";
import Popover from "~/components/Popover";
import Photos from "~/components/JobPhotos";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { Room, type Prisma } from "@prisma/client";
import ClickAwayListener from "~/components/ClickAwayListener";
import UploadPhotoButton from "~/components/UploadPhoto";
import { UploadDocumentWithLabelInput } from "~/components/UploadDocument";
import EditDatePopover from "~/components/EditDatePopover";
import AddTradePopover, {
  instanceOfTradeInfo,
} from "~/components/AddTradePopover";
import DocumentViewer from "~/components/DocumentViewer";
import PropertyHeroWithSelectedRooms from "~/components/PropertyHeroWithSelectedRooms";
import RoomSelector, { RoomFromLevels } from "~/components/RoomSelector";

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

  const jobLoading = job.isFetching || job.isLoading;

  if (!job.data) return <>Loading</>;
  // have some logic here, if has trade user, then display without any action buttons
  return <HomeownerJobPageWithJob job={job.data} jobLoading={jobLoading} />;
};

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type HomeownerJobPageWithJobProps = {
  job: Job;
  jobLoading: boolean;
};

const HomeownerJobPageWithJob: React.FC<HomeownerJobPageWithJobProps> = ({
  job,
  jobLoading,
}) => {
  const ctx = api.useContext();

  const refetchPhotosAfterUpload = () => {
    void ctx.photo.getPhotosForJobAndRoom.invalidate();
    void ctx.photo.getUnassignedPhotosForJob.invalidate();
  };

  return (
    <div className="grid justify-center">
      <h1 className="py-8 text-center font-sans text-4xl font-extrabold text-slate-900">
        {job.title}
      </h1>
      <JobDate date={job.date} jobId={job.id} />
      <JobCompletedBy tradeInfo={job.nonUserTradeInfo} jobId={job.id} />

      <PropertyHeroWithSelectedRooms
        Property={job.Property}
        rooms={job.rooms}
      />
      <RoomSelectorForJob job={job} jobLoading={jobLoading} />
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Documents
      </h2>
      <Documents job={job} />
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Notes
      </h2>
      <NotesViewer notes={job.notes} jobId={job.id} />
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

type JobDateProps = {
  date: Date;
  jobId: string;
};

const JobDate: React.FC<JobDateProps> = ({ date, jobId }) => {
  const [jobDayPickerOpen, setJobDayPickerOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(date);

  const ctx = api.useContext();

  const { mutate: updateDate } = api.job.updateDateForJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.job.getJobForHomeowner.invalidate();
      // close popover
      setJobDayPickerOpen(false);
    },
    onError: () => {
      toast("Failed to update Date for Job");
    },
  });

  const onClickUpdateDate = () => {
    // aysnc update date
    if (!!newDate) updateDate({ jobId: jobId, date: newDate });
    else toast("Could not update date, selected Date error");
  };

  return (
    <div className="mb-4 flex justify-center">
      <span className="place-self-center px-12 text-center text-lg text-slate-700 ">
        Job Completed On:{" "}
      </span>
      <EditDatePopover
        currentDate={date}
        newDate={newDate}
        setNewDate={setNewDate}
        jobDayPickerOpen={jobDayPickerOpen}
        setJobDayPickerOpen={setJobDayPickerOpen}
      >
        {!!newDate ? (
          <Button onClick={onClickUpdateDate}>
            Set New Date as {format(newDate, "PPP")}
          </Button>
        ) : (
          <></>
        )}
      </EditDatePopover>
    </div>
  );
};

type JobCompletedByProps = {
  tradeInfo: Prisma.JsonValue | null;
  jobId: string;
};

const JobCompletedBy: React.FC<JobCompletedByProps> = ({
  tradeInfo,
  jobId,
}) => {
  const [editTradeInfoOpen, setEditTradeInfoOpen] = useState(false);
  const [form, setForm] = useState({
    name:
      !!tradeInfo && instanceOfTradeInfo(tradeInfo) && tradeInfo.name
        ? tradeInfo.name
        : "",
    email:
      !!tradeInfo && instanceOfTradeInfo(tradeInfo) && tradeInfo.email
        ? tradeInfo.email
        : "",
    phone:
      !!tradeInfo && instanceOfTradeInfo(tradeInfo) && tradeInfo.phone
        ? tradeInfo.phone
        : "",
  });

  const ctx = api.useContext();

  const { mutate: updateTradeInfo } =
    api.job.updateTradeContactForJob.useMutation({
      onSuccess: () => {
        // Refetch job for page
        void ctx.job.getJobForHomeowner.invalidate();
        // close popover
        setEditTradeInfoOpen(false);
      },
      onError: () => {
        toast("Failed to update Trade information for Job");
      },
    });

  const onClickUpdate = () => {
    // check inputs?
    updateTradeInfo({
      jobId: jobId,
      tradeName: form.name,
      tradeEmail: form.email,
      tradePhone: form.phone,
    });
  };
  // Does job have a Trade User?
  return (
    <div className="grid place-items-center">
      <span className="pb-1 text-center text-lg text-slate-700">
        Job Completed By:{" "}
      </span>

      <AddTradePopover
        tradeInfo={tradeInfo}
        editPopoverOpen={editTradeInfoOpen}
        setEditPopoverOpen={setEditTradeInfoOpen}
        form={form}
        setForm={setForm}
        onClickUpdate={onClickUpdate}
      />
    </div>
  );
};

type DocumentProps = {
  job: Job;
};

const Documents: React.FC<DocumentProps> = ({ job }) => {
  const [uploadDocumentPopover, setUploadDocumentPopover] = useState(false);

  const { data: documents, isLoading: loading } =
    api.document.getDocumentsForJob.useQuery({ jobId: job.id });

  const ctx = api.useContext();

  const defaultDocumentsForJob = ["Invoice"]; //If documents label matches, then remove
  if (!!documents) {
    for (const document of documents) {
      const index = defaultDocumentsForJob.indexOf(document.label);
      console.log("INDEX", index);
      if (index >= 0) defaultDocumentsForJob.splice(index, 1);
    }
  }
  console.log("defaul;t docs", defaultDocumentsForJob);

  const refetchDataForPage = () => {
    void ctx.document.getDocumentsForJob.invalidate();
    setUploadDocumentPopover(false);
  };

  return (
    <div className="grid place-items-center">
      {!!documents ? (
        <DocumentViewer
          documents={documents}
          uploadFor="JOB"
          propertyId={job.Property.id}
          jobId={job.id}
          refetchDataForPage={refetchDataForPage}
          defaultDocuments={defaultDocumentsForJob}
        />
      ) : loading ? (
        <p>Loading</p>
      ) : (
        <p>error</p>
      )}

      <Button onClick={() => setUploadDocumentPopover(true)}>
        Upload Other Document
      </Button>
      <Popover
        popoveropen={uploadDocumentPopover}
        setPopoverOpen={setUploadDocumentPopover}
      >
        <UploadDocumentWithLabelInput
          uploadFor="JOB"
          jobId={job.id}
          refetchDataForPage={refetchDataForPage}
          propertyId={job.Property.id}
        />
      </Popover>
    </div>
  );
};

type Notes = Job["notes"];

type NotesViewerProps = {
  notes: Notes;
  jobId: string;
};

const NotesViewer: React.FC<NotesViewerProps> = ({ notes, jobId }) => {
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState(notes || "");

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
    <div className="grid w-full place-items-center px-4">
      {!!notes && (
        <div className="w-96 whitespace-pre-line text-base text-slate-700">
          {notes}
        </div>
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
            <Button onClick={onClickAddNotes}>+</Button>
          </div>
        </ClickAwayListener>
      ) : (
        <Button onClick={() => setAddNoteOpen(true)}>Add Note</Button>
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

type RoomSelectorForJobProps = {
  job: Job;
  jobLoading: boolean;
};

const RoomSelectorForJob: React.FC<RoomSelectorForJobProps> = ({
  job,
  jobLoading,
}) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "You cannot remove room which has photos linked to it, please remove photos first"
  );
  const [loading, setLoading] = useState(false);
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

  const ctx = api.useContext();

  const { mutate: addRoomToJob } = api.job.addRoomToJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      setError(false);
      void ctx.job.getJobForHomeowner.invalidate();
      setLoading(false);
      // close popover
      //closePopover();
    },
  });

  const { mutate: removeRoomFromJob } = api.job.removeRoomFromJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      setError(false);
      void ctx.job.getJobForHomeowner.invalidate();
      setLoading(false);
      // close popover
      // closePopover();
    },
    onError: (error) => {
      console.log(error);
      setError(true);
      setLoading(false);
    },
  });

  const onClickRoomAdd = (roomId: string) => {
    addRoomToJob({ jobId: job.id, roomId: roomId });
    console.log("new room added to job");
  };

  const onClickRoomRemove = (roomId: string) => {
    removeRoomFromJob({ jobId: job.id, roomId: roomId });
  };

  const checkRoomIsSelectedRoom = useCallback(
    (roomId: string) => {
      const result = job.rooms.find(
        (selectedRoom) => selectedRoom.id === roomId
      );
      return !!result;
    },
    [job.rooms]
  );

  return (
    <RoomSelector
      property={job.Property}
      error={error}
      setError={setError}
      errorMessage={errorMessage}
      jobLoading={jobLoading}
      loading={loading}
      setLoading={setLoading}
      onClickRoomAdd={onClickRoomAdd}
      onClickRoomRemove={onClickRoomRemove}
      checkRoomSelected={checkRoomIsSelectedRoom}
      roomSelectorOpen={roomSelectorOpen}
      setRoomSelectorOpen={setRoomSelectorOpen}
    >
      <Button
        onClick={() => setRoomSelectorOpen(true)}
        className="my-6 w-48 place-self-center"
      >
        Select Rooms
      </Button>
    </RoomSelector>
  );
};
