import { concatAddress } from "~/components/Molecules/Properties/Property";
import Jobs, { type SelectedJobs } from "~/components/Jobs";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { RouterOutputs, api } from "~/utils/api";
import PhotoViewer from "~/components/Molecules/PhotoViewer";
import { Level, Room } from "@prisma/client";
import RoomSelectorPopover from "~/components/Molecules/RoomSelector";

//const initialRoom:selectedRoom = {level: '', room: ''};
//const initialJob: IJob = {id: '', title:" ", date: new Date(), documents: [], photos: [], notes: [], property: {apartment: '', streetnumber: '', street: '', suburb: '', postcode: '', state: '', country: '', lastjob: '', levels: []}}
export type SelectedRoom = {
  room: Room | null;
  level: Level | null;
};

type JobsForSelectedRoomProps = {
  selectedRoom: SelectedRoom;
  selectedJobs: SelectedJobs;
  setSelectedJobs: Dispatch<SetStateAction<SelectedJobs>>;
};

const getSelectedJobsIds = (selectedJobs: SelectedJobs) => {
  const jobIds: string[] = [];
  for (const selectedJob of selectedJobs) {
    jobIds.push(selectedJob.id);
  }
  return jobIds;
};

const JobsForSelectedRoom: React.FC<JobsForSelectedRoomProps> = ({
  selectedRoom,
  selectedJobs,
  setSelectedJobs,
}) => {
  // get Jobs for the selected room
  if (!selectedRoom.room) return <>no room selected</>;
  const jobs = api.job.getJobsForRoom.useQuery({
    roomId: selectedRoom.room.id,
  });
  // when room changes we want to select all jobs

  if (!jobs.data) return <>loading jobs</>;
  return <></>;
};

type PropertyPhotoSearchPageWithParamsProps = {
  propertyId: string;
};

const PropertyPhotoSearchPageWithParams: React.FC<
  PropertyPhotoSearchPageWithParamsProps
> = ({ propertyId }) => {
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom>({
    room: null,
    level: null,
  });
  const [selectedJobs, setSelectedJobs] = useState<SelectedJobs>([]);
  console.log("Slected jobs", selectedJobs);

  useEffect(() => {
    setSelectedJobs([]);
  }, [selectedRoom.room?.id]);

  const property = api.property.getPropertyForUser.useQuery({ id: propertyId });
  if (!property.data) return <>Loading</>;

  const address = concatAddress(property.data);

  const selectedJobIds = getSelectedJobsIds(selectedJobs);

  return (
    <div className="flex grid w-9/12 grid-cols-1  flex-col md:w-8/12 lg:w-7/12 xl:w-128">
      <h1 className="py-8 text-center font-sans text-4xl font-extrabold text-slate-900">
        {address}
      </h1>
      <h2 className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
        This is your Dashboard. Select a specific property or browse recent jobs
        here.
      </h2>
      <div className="flex flex-wrap justify-between gap-8">
        <RoomSelectorForPhotoSearch
          property={property.data}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
        <JobsForSelectedRoom
          selectedRoom={selectedRoom}
          selectedJobs={selectedJobs}
          setSelectedJobs={setSelectedJobs}
        />
      </div>
      <div className="border-b-4 border-slate-600 pt-8 text-slate-600">
        Photos{" "}
      </div>
      {selectedJobs.length > 0 &&
        !!selectedRoom.room &&
        selectedRoom.room.id && (
          <PhotoViewer2
            selectedRoomId={selectedRoom.room.id}
            selectedJobIds={selectedJobIds}
          />
        )}
    </div>
  );
};

const PropertyPhotoSearchPage = () => {
  const id = useRouter().query.index?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id) return <>loading</>;

  return <PropertyPhotoSearchPageWithParams propertyId={id} />;
};

type PhotoViewer2Props = {
  selectedRoomId: string;
  selectedJobIds: string[];
};

const PhotoViewer2: React.FC<PhotoViewer2Props> = ({
  selectedRoomId,
  selectedJobIds,
}) => {
  const { data: photos } = api.photo.getPhotosForJobsAndRoom.useQuery({
    jobIds: selectedJobIds,
    roomId: selectedRoomId,
  });
  return <>{!!photos && <PhotoViewer photos={photos} />}</>;
};

export default PropertyPhotoSearchPage;

type Property = RouterOutputs["property"]["getPropertyForUser"];

type RoomSelectorForJobProps = {
  property: Property;
  selectedRoom: SelectedRoom;
  setSelectedRoom: Dispatch<SetStateAction<SelectedRoom>>;
};

const RoomSelectorForPhotoSearch: React.FC<RoomSelectorForJobProps> = ({
  property,
  selectedRoom,
  setSelectedRoom,
}) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "You cannot remove room which has photos linked to it, please remove photos first"
  );
  const [loading, setLoading] = useState(false);
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

  const ctx = api.useContext();

  const onClickRoomAdd = (roomId: string) => {
    // Need to know the room and level, from roomId
    const level = property.levels.find((level) => {
      const result = level.rooms.find((room) => room.id === roomId);
      return !!result;
    });
    console.log("level", level);
    // Need to know the room, from roomId
    let room;
    if (!!level) room = level.rooms.find((room) => room.id === roomId);
    if (!!level && !!room) setSelectedRoom({ room: room, level: level });
    setLoading(false);
  };

  const onClickRoomRemove = (roomId: string) => {
    // Do Noting
  };

  const checkRoomIsSelectedRoom = useCallback(
    (roomId: string) => {
      const result = selectedRoom.room?.id === roomId;
      return !!result;
    },
    [selectedRoom]
  );

  return (
    <RoomSelectorPopover
      property={property}
      error={error}
      setError={setError}
      errorMessage={errorMessage}
      loading={loading}
      setLoading={setLoading}
      onClickRoomAdd={onClickRoomAdd}
      onClickRoomRemove={onClickRoomRemove}
      checkRoomSelected={checkRoomIsSelectedRoom}
      roomSelectorOpen={roomSelectorOpen}
      setRoomSelectorOpen={setRoomSelectorOpen}
    >
      <button
        type="button"
        className="flex h-8 items-center justify-center text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        onClick={() => setRoomSelectorOpen(true)}
      >
        <p className="">Select Room</p>

        <svg fill="currentColor" viewBox="0 0 20 20" className="h-8 w-8">
          <path
            x-show="!open"
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
          ></path>
        </svg>
        <p className="rounded border border-teal-800 bg-teal-300 p-2">
          {selectedRoom.level?.label} &gt; {selectedRoom.room?.label}
        </p>
      </button>
    </RoomSelectorPopover>
  );
};
