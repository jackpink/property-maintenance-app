import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UploadPhotoButton from "../Molecules/UploadPhoto";
import { RouterOutputs, api } from "~/utils/api";
import PhotosViewerWithRoomSelector from "../Molecules/PhotosViewerWithRoomSelector";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";

type Job = RouterOutputs["job"]["getJob"];

type Photos = RouterOutputs["photo"]["getUnassignedPhotosForJob"];

type JobPhotosProps = {
  job: Job;
};

const JobPhotos: React.FC<JobPhotosProps> = ({ job }) => {
  const [selectedRoom, setSelectedRoom] = useState("UNASSIGNED");

  const ctx = api.useContext();

  const { data: unassignedPhotos } =
    api.photo.getUnassignedPhotosForJob.useQuery({
      jobId: job.id,
    });

  const refetchDataForPage = () => {
    void ctx.photo.getPhotosForJobAndRoom.invalidate();
    void ctx.photo.getUnassignedPhotosForJob.invalidate();
  };

  const unassignedPhotosToDisplay =
    !!unassignedPhotos && unassignedPhotos.length > 0;

  useEffect(() => {
    if (!unassignedPhotosToDisplay && job.rooms[0])
      setSelectedRoom(job.rooms[0].id);
    else setSelectedRoom("UNASSIGNED");
  }, [unassignedPhotos]);

  return (
    <div className="flex flex-col	">
      <UploadPhotoButton
        jobId={job.id}
        propertyId={job.Property.id}
        multipleUploads={true}
        refetchPageData={refetchDataForPage}
        userType="HOMEOWNER"
      />
      <RoomSelectorDropdown
        rooms={job.rooms}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        unassignedPhotos={unassignedPhotosToDisplay}
      />
      {selectedRoom === "UNASSIGNED" && unassignedPhotos ? (
        <UnassignedPhotos
          photos={unassignedPhotos}
          rooms={job.rooms}
          refetchDataForPage={refetchDataForPage}
        />
      ) : (
        <RoomPhotos
          job={job}
          roomId={selectedRoom}
          refetchDataForPage={refetchDataForPage}
        />
      )}
    </div>
  );
};
type RoomSelectorDropdownProps = {
  rooms: Job["rooms"];
  selectedRoom: string;
  setSelectedRoom: Dispatch<SetStateAction<string>>;
  unassignedPhotos: boolean;
};

const RoomSelectorDropdown: React.FC<RoomSelectorDropdownProps> = ({
  rooms,
  selectedRoom,
  setSelectedRoom,
  unassignedPhotos,
}) => {
  return (
    <>
      <select
        className="place-self-center rounded-full border-2 border-solid border-black p-3	text-center"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
      >
        {unassignedPhotos && <option value="UNASSIGNED">UNASSIGNED</option>}
        {rooms.map((room, index) => {
          return (
            <option key={index} value={room.id}>
              {room.Level.label.toUpperCase() + "→" + room.label.toUpperCase()}
            </option>
          );
        })}
      </select>
    </>
  );
};

type UnassignedPhotosProps = {
  photos: Photos;
  rooms: Job["rooms"];
  refetchDataForPage: () => void;
};

const UnassignedPhotos: React.FC<UnassignedPhotosProps> = ({
  photos,
  rooms,
  refetchDataForPage,
}) => {
  if (!!photos && photos.length > 0) {
    console.log(photos);
    return (
      <div>
        <PhotosViewerWithRoomSelector
          photos={photos}
          rooms={rooms}
          refetchDataForPage={refetchDataForPage}
        />
      </div>
    );
  }
  return <p>no photo</p>;
};

type RoomPhotosProps = {
  job: Job;
  roomId: string;
  refetchDataForPage: () => void;
};

const RoomPhotos: React.FC<RoomPhotosProps> = ({
  job,
  roomId,
  refetchDataForPage,
}) => {
  const { data: photos } = api.photo.getPhotosForJobAndRoom.useQuery({
    jobId: job.id,
    roomId: roomId,
  });

  if (!!photos && photos.length > 0) {
    console.log(photos);
    return (
      <div>
        <PhotosViewerWithRoomSelector
          photos={photos}
          rooms={job.rooms}
          refetchDataForPage={refetchDataForPage}
        />
      </div>
    );
  }
  return <p>no room photos</p>;
};

export default JobPhotos;
