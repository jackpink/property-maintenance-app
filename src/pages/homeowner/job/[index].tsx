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
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { uploadFileToSignedURL } from "../../../utils/upload";

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
  const address = concatAddress(job.Property);

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
      <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
        Photos
      </h2>
      <UploadPhotoButton job={job} />
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
    <>
      <p className="place-self-center px-12 pb-4 text-center text-lg text-slate-700">
        Job Completed On:{" "}
        <button
          onClick={() => setJobDayPickerOpen(true)}
          className="rounded-md border-2 border-black p-1"
        >
          {date.toDateString()}
        </button>
      </p>

      <Popover
        popoveropen={jobDayPickerOpen}
        setPopoverOpen={setJobDayPickerOpen}
      >
        <div className="grid place-items-center text-center">
          <p className="block text-sm font-medium text-gray-700">
            Current Job Date:
            {date ? <> {format(date, "PPP")}</> : <></>}
          </p>
          <DayPicker
            mode="single"
            required
            selected={newDate}
            onSelect={setNewDate}
          />

          {!!newDate ? (
            <Button onClick={onClickUpdateDate}>
              Set New Date as {format(newDate, "PPP")}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </Popover>
    </>
  );
};

type Form = {
  name: string;
  nameError: boolean;
  nameErrorMessage: string;
  email: string;
  emailError: boolean;
  emailErrorMessage: string;
  phone: string;
  phoneError: boolean;
  phoneErrorMessage: string;
};

const initialForm: Form = {
  name: "",
  nameError: false,
  nameErrorMessage: "",
  email: "",
  emailError: false,
  emailErrorMessage: "",
  phone: "",
  phoneError: false,
  phoneErrorMessage: "",
};

const ValidNameInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

type JobCompletedByProps = {
  tradeInfo: Prisma.JsonValue | null;
  jobId: string;
};

function instanceOfTradeInfo(object: any): object is ITradeInfo {
  return "name" in object && "email" in object && "phone" in object;
}

const JobCompletedBy: React.FC<JobCompletedByProps> = ({
  tradeInfo,
  jobId,
}) => {
  const [editTradeInfo, setEditTradeInfo] = useState(false);
  const [form, setForm] = useState({
    name:
      !!tradeInfo && instanceOfTradeInfo(tradeInfo) && tradeInfo.name
        ? tradeInfo.name
        : "",
    nameError: false,
    nameErrorMessage: "",
    email:
      !!tradeInfo && instanceOfTradeInfo(tradeInfo) && tradeInfo.email
        ? tradeInfo.email
        : "",
    emailError: false,
    emailErrorMessage: "",
    phone:
      !!tradeInfo && instanceOfTradeInfo(tradeInfo) && tradeInfo.phone
        ? tradeInfo.phone
        : "",
    phoneError: false,
    phoneErrorMessage: "",
  });

  const ctx = api.useContext();

  const { mutate: updateTradeInfo } =
    api.job.updateTradeContactForJob.useMutation({
      onSuccess: () => {
        // Refetch job for page
        void ctx.job.getJobForHomeowner.invalidate();
        // close popover
        setEditTradeInfo(false);
      },
      onError: () => {
        toast("Failed to update Trade information for Job");
      },
    });

  const onClickUpdate = () => {
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
      {!!tradeInfo && instanceOfTradeInfo(tradeInfo) ? (
        <button
          onClick={() => setEditTradeInfo(true)}
          className="mb-4 rounded-md border-2 border-black p-1"
        >
          <p className="pb-4 text-center text-xl text-slate-700">
            {tradeInfo.name}
          </p>
          <p className="text-left text-slate-600">
            <span className="font-light">Email: </span>
            {tradeInfo.email}
          </p>

          <p className="text-left text-slate-600">
            <span className="font-light">Phone Number: {"   "}</span>
            {tradeInfo.phone}
          </p>
          <span></span>
        </button>
      ) : (
        <button
          onClick={() => setEditTradeInfo(true)}
          className="mb-6 rounded-md border-2 border-black p-1 text-center text-lg text-slate-700"
        >
          Add Information for Trade
        </button>
      )}
      <Popover popoveropen={editTradeInfo} setPopoverOpen={setEditTradeInfo}>
        <div className="grid place-items-center">
          <h1 className="pb-4 text-2xl text-slate-700">
            Edit Details for Trade
          </h1>
          <label className="text-lg text-slate-700">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mb-4 rounded-md border-2 border-slate-400 p-1"
          />
          <label className="text-lg text-slate-700">Email (Optional)</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mb-4 rounded-md border-2 border-slate-400 p-1"
          />
          <label className="text-lg text-slate-700">
            Phone Number (Optional)
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mb-4 rounded-md border-2 border-slate-400 p-1"
          />
          <Button onClick={onClickUpdate}>Update Job Trade Information</Button>
        </div>
      </Popover>
    </div>
  );
};

type DocumentViewerProps = {
  job: Job;
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ job }) => {
  const [uploadDocumentPopover, setUploadDocumentPopover] = useState(false);
  const [label, setLabel] = useState("");

  return (
    <div className="grid place-items-center">
      <Button onClick={() => setUploadDocumentPopover(true)}>
        Upload Other Document
      </Button>
      <Popover
        popoveropen={uploadDocumentPopover}
        setPopoverOpen={setUploadDocumentPopover}
      >
        <div className="grid place-items-center">
          <h1 className="pb-4 text-2xl text-slate-700">
            Add a label for the Document before uploading
          </h1>
          <label className="text-lg text-slate-700">Label </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mb-4 rounded-md border-2 border-slate-400 p-1"
          />
          <UploadDocumentButton job={job} label={label} />
        </div>
      </Popover>
    </div>
  );
};

type UploadDocumentButtonProps = {
  job: Job;
  label: string;
};

const UploadDocumentButton: React.FC<UploadDocumentButtonProps> = ({
  job,
  label,
}) => {
  const { mutateAsync: getPresignedUrl } =
    api.document.getDocumentUploadPresignedUrl.useMutation();

  const { mutateAsync: createDocumentRecord } =
    api.document.createDocumentRecord.useMutation();

  const ctx = api.useContext();

  const uploadFile = async (file: File) => {
    // Need to check that file is correct type (ie jpeg/png/tif/etc)
    console.log("Getting Presigned URL for file ", file.name);
    const { url, filename } = await getPresignedUrl({
      key: file.name,
      property: job.Property.id,
    });

    console.log("Uploading Image to Presigned URL ", file.name, filename);
    const fileName = await uploadFileToSignedURL(url, file, filename);

    console.log("Creating Photo Record for DB ", file.name, fileName);
    const newPhoto = await createDocumentRecord({
      filename: fileName,
      label: label,
      jobId: job.id,
    });

    console.log("Refetching Photos for Page", newPhoto);
    newPhoto && void ctx.document.getDocumentsForJob.invalidate();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const promiseArray = [];
      for (const file of fileArray) {
        promiseArray.push(uploadFile(file));
      }
      void Promise.all(promiseArray);
    }
  };

  return (
    <>
      <label
        htmlFor="photo-upload-input"
        className="place-self-center rounded border border-teal-800 bg-teal-300 p-2 text-xl font-extrabold  text-slate-900"
      >
        Upload Document
      </label>
      <input
        onChange={handleFileChange}
        multiple
        type="file"
        id="photo-upload-input"
        className="opacity-0"
      />
    </>
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
  return <>no photo</>;
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

type UploadPhotoButtonProps = {
  job: Job;
};

const UploadPhotoButton: React.FC<UploadPhotoButtonProps> = ({ job }) => {
  const { mutateAsync: getPresignedUrl } =
    api.photo.getPhotoUploadPresignedUrl.useMutation();

  const { mutateAsync: createPhotoRecord } =
    api.photo.createPhotoRecord.useMutation();

  const ctx = api.useContext();

  const refetchPhotosAfterUpload = () => {
    void ctx.photo.getPhotosForJobAndRoom.invalidate();
    void ctx.photo.getUnassignedPhotosForJob.invalidate();
  };

  const uploadFile = async (file: File) => {
    // Need to check that file is correct type (ie jpeg/png/tif/etc)
    console.log("Getting Presigned URL for file ", file.name);
    const { url, filename } = await getPresignedUrl({
      key: file.name,
      property: job.Property.id,
    });

    console.log("Uploading Image to Presigned URL ", file.name, filename);
    const fileName = await uploadFileToSignedURL(url, file, filename);

    console.log("Creating Photo Record for DB ", file.name, fileName);
    const newPhoto = await createPhotoRecord({
      filename: fileName,
      jobId: job.id,
    });

    console.log("Refetching Photos for Page", newPhoto);
    newPhoto && refetchPhotosAfterUpload();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const promiseArray = [];
      for (const file of fileArray) {
        promiseArray.push(uploadFile(file));
      }
      void Promise.all(promiseArray);
    }
  };

  return (
    <>
      <label
        htmlFor="photo-upload-input"
        className="place-self-center rounded border border-teal-800 bg-teal-300 p-2 text-xl font-extrabold  text-slate-900"
      >
        Upload Photo
      </label>
      <input
        onChange={handleFileChange}
        multiple
        type="file"
        id="photo-upload-input"
        className="opacity-0"
      />
    </>
  );
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
      void ctx.job.getJobForTradeUser.invalidate();
      // close popover
      closePopover();
    },
  });

  const { mutate: removeRoomFromJob } = api.job.removeRoomFromJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      setRemoveError(false);
      void ctx.job.getJobForTradeUser.invalidate();
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
