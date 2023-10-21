import { concatAddress } from "~/components/Properties/Property";
import Rooms, { type SelectedRoom } from "~/components/Rooms";
import Jobs, { type SelectedJobs } from "~/components/Jobs";
import Documents from "~/components/Documents";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Photos from "~/components/Photos";
import { Level, Room } from "@prisma/client";

//const initialRoom:selectedRoom = {level: '', room: ''};
//const initialJob: IJob = {id: '', title:" ", date: new Date(), documents: [], photos: [], notes: [], property: {apartment: '', streetnumber: '', street: '', suburb: '', postcode: '', state: '', country: '', lastjob: '', levels: []}}

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
  if (!jobs.data) return <>loading jobs</>;
  return (
    <Jobs
      jobs={jobs.data}
      selectedJobs={selectedJobs}
      setSelectedJobs={setSelectedJobs}
    />
  );
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
        <Rooms
          levels={property.data.levels}
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
          <PhotoViewer
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

type PhotoViewerProps = {
  selectedRoomId: string;
  selectedJobIds: string[];
};

const PhotoViewer: React.FC<PhotoViewerProps> = ({
  selectedRoomId,
  selectedJobIds,
}) => {
  const { data: photos } = api.photo.getPhotosForJobsAndRoom.useQuery({
    jobIds: selectedJobIds,
    roomId: selectedRoomId,
  });
  return <>{!!photos && <Photos photos={photos} />}</>;
};

export default PropertyPhotoSearchPage;
