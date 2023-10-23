import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import { concatAddress } from "~/components/Properties/Property";
import Link from "next/link";
import Image from "next/image";
import house from "../../../images/demo-page/house-stock-image.png";
import Button from "~/components/Button";
import Popover from "~/components/Popover";
import Photos from "~/components/JobPhotos";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { type Prisma } from "@prisma/client";
import ClickAwayListener from "~/components/ClickAwayListener";
import UploadPhotoButton from "~/components/UploadPhoto";
import { UploadDocumentWithLabelInput } from "~/components/UploadDocument";
import EditDatePopover from "~/components/EditDatePopover";
import AddTradePopover, {
  instanceOfTradeInfo,
} from "~/components/AddTradePopover";

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

  if (!job.data) return <>Loading</>;
  // have some logic here, if has trade user, then display without any action buttons
  return <HomeownerJobPageWithJob job={job.data} />;
};

type Job = RouterOutputs["job"]["getJobForTradeUser"];

type HomeownerJobPageWithJobProps = {
  job: Job;
};

const HomeownerJobPageWithJob: React.FC<HomeownerJobPageWithJobProps> = ({
  job,
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

      <Property job={job} />
      <RoomSelector job={job} />
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Documents
      </h2>
      <DocumentViewer job={job} />
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

type DocumentViewerProps = {
  job: Job;
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ job }) => {
  const [uploadDocumentPopover, setUploadDocumentPopover] = useState(false);

  const { data: documents, isLoading: loading } =
    api.document.getDocumentsForJob.useQuery({ jobId: job.id });

  const ctx = api.useContext();

  const refetchDataForPage = () => {
    void ctx.document.getDocumentsForJob.invalidate();
    setUploadDocumentPopover(false);
  };

  return (
    <div className="grid place-items-center">
      {!!documents ? (
        <Documents documents={documents} />
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

type Documents = RouterOutputs["document"]["getDocumentsForJob"];

type DocumentsProps = {
  documents: Documents;
};

const Documents: React.FC<DocumentsProps> = ({ documents }) => {
  return (
    <div className="flex flex-wrap">
      {documents.map((document, index) => (
        <Document document={document} key={index} />
      ))}
    </div>
  );
};
type Document = Documents[number];

type DocumentProps = {
  document: Document;
};
const Document: React.FC<DocumentProps> = ({ document }) => {
  const [documentOpen, setDocumentOpen] = useState(false);
  const { data: pdfUrl } = api.document.getDocument.useQuery({
    filename: document.filename,
  });
  console.log("docuemnt url", pdfUrl);
  return (
    <div>
      <button className="m-2 p-2" onClick={() => setDocumentOpen(true)}>
        <svg width="60" viewBox="0 0 130 170">
          <g id="layer1" transform="translate(-246.43 -187.36)">
            <path
              id="rect7452"
              d="m246.43 187.36v170h130v-141.34l-28.625-28.656h-101.38zm97.5 5 27.5 27.531h-27.5v-27.531zm-72.5 61.188h80v7h-80v-7zm0 30.625h80v7h-80v-7zm0 30.656h80v7h-80v-7z"
            />
          </g>
        </svg>
        <p>{document.label}</p>
      </button>
      {!!pdfUrl && (
        <Popover popoveropen={documentOpen} setPopoverOpen={setDocumentOpen}>
          <div className="h-screen">
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>
                This browser does not support PDFs. Please download the PDF to
                view it: <a href={pdfUrl}>Download PDF</a>.
              </p>
            </object>
          </div>
        </Popover>
      )}
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

type RoomFromLevels =
  RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number]["rooms"][number];

type RoomButtonProps = {
  className: string;
  room: RoomFromLevels;
  job: Job;
  closePopover: () => void;
  setRemoveError: Dispatch<SetStateAction<boolean>>;
};

const checkRoomIsSelectedRoom = (
  room: RoomFromLevels,
  selectedRooms: RoomFromLevels[]
) => {
  const result = selectedRooms.find(
    (selectedRoom) => selectedRoom.id === room.id
  );
  return result;
};

export const RoomButton: React.FC<RoomButtonProps> = ({
  className,
  room,
  job,
  closePopover,
  setRemoveError,
}) => {
  const ctx = api.useContext();

  const { mutate: addRoomToJob } = api.job.addRoomToJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.job.getJobForHomeowner.invalidate();
      // close popover
      closePopover();
    },
  });

  const { mutate: removeRoomFromJob } = api.job.removeRoomFromJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      setRemoveError(false);
      void ctx.job.getJobForHomeowner.invalidate();
      // close popover
      closePopover();
    },
    onError: (error) => {
      console.log(error);
      setRemoveError(true);
    },
  });

  const addRoomButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Add room to job mutation
    addRoomToJob({ jobId: job.id, roomId: event.currentTarget.value });
    console.log("new room added to job");
  };
  const removeRoomButtonClicked = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Add room to job mutation
    removeRoomFromJob({ jobId: job.id, roomId: event.currentTarget.value });
  };
  if (checkRoomIsSelectedRoom(room, job.rooms)) {
    return (
      <button
        onClick={removeRoomButtonClicked}
        value={room.id}
        className={clsx(
          className,
          "rounded border-2 border-teal-800 bg-teal-300 p-2"
        )}
      >
        {room.label}
      </button>
    );
  }
  return (
    <button
      value={room.id}
      onClick={addRoomButtonClicked}
      className={clsx(className, "rounded border border-teal-800 p-2")}
    >
      {room.label}
    </button>
  );
};

type Level =
  RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number];

type LevelProps = {
  level: Level;
  job: Job;
  closePopover: () => void;
  setRemoveError: Dispatch<SetStateAction<boolean>>;
};

export const Level: React.FC<LevelProps> = ({
  level,
  job,
  closePopover,
  setRemoveError,
}) => {
  return (
    <div className="w-60 text-center">
      <h1>{level?.label}</h1>
      {level?.rooms.map((room, index) => (
        <div key={index} className="grid grid-cols-1 gap-2 p-2">
          <RoomButton
            className=""
            key={index}
            room={room}
            job={job}
            closePopover={closePopover}
            setRemoveError={setRemoveError}
          />
        </div>
      ))}
    </div>
  );
};

type RoomSelectorProps = {
  job: Job;
};

const RoomSelector: React.FC<RoomSelectorProps> = ({ job }) => {
  const [removeError, setRemoveError] = useState(false);
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

  useEffect(() => {
    if (roomSelectorOpen === false) setRemoveError(false);
  }, [roomSelectorOpen]);

  const closePopover = () => {
    setRoomSelectorOpen(false);
    setRemoveError(false);
  };

  return (
    <div className="grid">
      <Button
        onClick={() => setRoomSelectorOpen(true)}
        className="my-6 w-48 place-self-center"
      >
        Select Rooms
      </Button>
      <Popover
        popoveropen={roomSelectorOpen}
        setPopoverOpen={setRoomSelectorOpen}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {job.Property.levels.map((level, index) => {
            return (
              <Level
                level={level}
                key={index}
                job={job}
                closePopover={closePopover}
                setRemoveError={setRemoveError}
              />
            );
          })}
        </div>
        {removeError ? (
          <p className="text-red-500">
            ⚠️ You cannot remove room which has photos linked to it, please
            remove photos first
          </p>
        ) : (
          <></>
        )}
      </Popover>
    </div>
  );
};

type Property = RouterOutputs["job"]["getJobForTradeUser"]["Property"];

type PropertyProps = {
  job: Job;
};

const Property: React.FC<PropertyProps> = ({ job }) => {
  const address = concatAddress(job.Property);
  const rooms = job.rooms;
  return (
    <Link
      href={`/homeowner/property/${job.Property.id}`}
      className="w-3/4 place-self-center md:w-1/2"
    >
      <div className="grid grid-cols-3 rounded-xl border-2 border-solid border-teal-800 hover:bg-black/20">
        <Image
          alt="House Stock Image"
          src={house}
          className="min-w-xl rounded-xl p-3"
        />
        <div className="relative col-span-2">
          <h1 className="p-3 text-lg font-extrabold text-slate-900 lg:text-2xl">
            {address}
          </h1>
          {rooms.map((room, index) => {
            return (
              <p className="text-xs font-light text-slate-600" key={index}>
                {room.Level.label.toUpperCase() +
                  "→" +
                  room.label.toUpperCase()}
              </p>
            );
          })}
        </div>
      </div>
    </Link>
  );
};
