import { type RouterOutputs, api } from "~/utils/api";
import Popover from "../Atoms/Popover";
import { type Dispatch, type SetStateAction, useState } from "react";
import { CTAButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { FullSizePhoto } from "./PhotoViewer";
import SelectablePhoto from "./SelectablePhoto";

type Photos = RouterOutputs["photo"]["getUnassignedPhotosForJob"];

export type Photo = Photos[number];

type Rooms = RouterOutputs["job"]["getJobForTradeUser"]["rooms"];

type PhotosViewerWithRoomSelectorProps = {
  photos: Photos;
  rooms: Rooms;
  refetchDataForPage: () => void;
};

const PhotosViewerWithRoomSelector: React.FC<
  PhotosViewerWithRoomSelectorProps
> = ({ photos, rooms, refetchDataForPage }) => {
  const [assignMode, setAssignMode] = useState(false);
  const [roomAssignButtonsOpen, setRoomAssignButtonsOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const { mutate: movePhotoToRoom } = api.photo.movePhotoToRoom.useMutation({
    onSuccess: () => {
      // disable assign mode
      setAssignMode(false);
      // refetch our photos
      refetchDataForPage();

      console.log("Photo Moved to Room");
      setRoomAssignButtonsOpen(false);
    },
  });

  const addToSelectedPhotos = (photoId: string) => {
    setSelectedPhotos((prevSelectedPhotos) => [...prevSelectedPhotos, photoId]);
  };

  const exitAssignMode = () => {
    setAssignMode(false);
    console.log(selectedPhotos);
    setSelectedPhotos([]);
  };

  const moveSelectedPhotosToRoom = (roomId: string) => {
    // Get all selected photos
    console.log(selectedPhotos);
    selectedPhotos.forEach((photoId) => {
      console.log("Moving photo to room ", photoId, roomId);
      movePhotoToRoom({ photoId: photoId, roomId: roomId });
    });
  };

  const click = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.value);
    moveSelectedPhotosToRoom(event.currentTarget.value);
  };

  return (
    <div>
      <Popover
        popoveropen={roomAssignButtonsOpen}
        setPopoverOpen={setRoomAssignButtonsOpen}
      >
        <div className="flex flex-col justify-center py-28 text-center">
          <h1 className="text-lg">Assign Selected Photos to Room</h1>
          {rooms.map((room, index) => {
            return (
              <CTAButton
                onClick={click}
                value={room.id}
                className="my-4 md:w-96"
                key={index}
              >
                {room.Level.label.toUpperCase() +
                  "→" +
                  room.label.toUpperCase()}
              </CTAButton>
            );
          })}
        </div>
      </Popover>
      <div className="flex flex-wrap justify-center gap-4 pt-8">
        {photos.map((photo, index, photoArray) => {
          return (
            <Photo
              key={index}
              photo={photo}
              index={index}
              selectedPhotos={selectedPhotos}
              setSelectedPhotos={setSelectedPhotos}
              photoArray={photoArray}
              assignMode={assignMode}
              setAssignMode={setAssignMode}
              addToSelectedPhotos={addToSelectedPhotos}
            />
          );
        })}
        {assignMode ? (
          <div className="fixed bottom-6 w-full">
            <CTAButton
              onClick={() => setRoomAssignButtonsOpen(true)}
              className="w-2/3 p-6"
            >
              Move to Room
            </CTAButton>
            <CTAButton onClick={exitAssignMode} className="ml-5 p-6">
              X
            </CTAButton>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

type PhotoProps = {
  photo: Photo;
  index: number;
  selectedPhotos: string[];
  setSelectedPhotos: Dispatch<SetStateAction<string[]>>;
  photoArray: Photo[];
  assignMode: boolean;
  setAssignMode: Dispatch<SetStateAction<boolean>>;
  addToSelectedPhotos: (photoId: string) => void;
};

const Photo: React.FC<PhotoProps> = ({
  photo,
  index,
  selectedPhotos,
  setSelectedPhotos,
  photoArray,
  assignMode,
  setAssignMode,
  addToSelectedPhotos,
}) => {
  const [fullSizePhotoOpen, setFullSizePhotoOpen] = useState(false);

  const { data: url } = api.photo.getPhoto.useQuery({
    name: photo.filename,
    type: "sm",
  });

  console.log("get photo url ", url);

  const photoLoading = typeof url !== "string";
  //if (typeof url !== "string") return <div className="">Loading</div>; ///THIS Is why ref is null, look into lazy loading with next
  return (
    <>
      {photoLoading ? (
        <div className="h-52 w-52">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Popover
            popoveropen={fullSizePhotoOpen}
            setPopoverOpen={setFullSizePhotoOpen}
          >
            <FullSizePhoto index={index} photoArray={photoArray} />
          </Popover>
          <SelectablePhoto
            photo={photo}
            url={url}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            assignMode={assignMode}
            setAssignMode={setAssignMode}
            addToSelectedPhotos={addToSelectedPhotos}
            setFullSizePhotoOpen={setFullSizePhotoOpen}
          />
        </>
      )}
    </>
  );
};

export default PhotosViewerWithRoomSelector;
