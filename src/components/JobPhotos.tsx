/*
Will need to add a full size image popover, which lets   */
import { type RouterOutputs, api } from "~/utils/api";
import Popover from "./Atoms/Popover";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CTAButton } from "./Atoms/Button";
import LoadingSpinner from "./Atoms/LoadingSpinner";
import { FullSizePhoto } from "./Molecules/PhotoViewer";

type Photo = RouterOutputs["photo"]["getUnassignedPhotosForJob"][number];

type Photos = RouterOutputs["photo"]["getUnassignedPhotosForJob"];

type Rooms = RouterOutputs["job"]["getJobForTradeUser"]["rooms"];

type Props = {
  photos: Photos;
  rooms: Rooms;
};

const Photos: React.FC<Props> = ({ photos, rooms }) => {
  const [assignMode, setAssignMode] = useState(false);
  const [roomAssignButtonsOpen, setRoomAssignButtonsOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const ctx = api.useContext();

  const { mutate: movePhotoToRoom } = api.photo.movePhotoToRoom.useMutation({
    onSuccess: () => {
      // disable assign mode
      setAssignMode(false);
      // refetch our photos
      void ctx.photo.getPhotosForJobAndRoom.invalidate();
      void ctx.photo.getUnassignedPhotosForJob.invalidate();
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

export default Photos;

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

type SelectablePhotoProps = {
  photo: Photo;
  url: string;
  assignMode: boolean;
  selectedPhotos: string[];
  setSelectedPhotos: Dispatch<SetStateAction<string[]>>;
  setAssignMode: Dispatch<SetStateAction<boolean>>;
  addToSelectedPhotos: (photoId: string) => void;
  setFullSizePhotoOpen: Dispatch<SetStateAction<boolean>>;
};

const SelectablePhoto: React.FC<SelectablePhotoProps> = ({
  photo,
  url,
  selectedPhotos,
  setSelectedPhotos,
  assignMode,
  setAssignMode,
  addToSelectedPhotos,
  setFullSizePhotoOpen,
}) => {
  const [photoSelected, setPhotoSelected] = useState(false);
  const photoRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number>(0);

  const enableAssignMode = () => {
    setAssignMode(true);
    setPhotoSelected(true);
    addToSelectedPhotos(photo.id);
  };

  const togglePhotoSelected = () => {
    console.log("TOGGLE PHOTO SELECTED", photoSelected);
    if (photoSelected) {
      // deselect and remve
      console.log("DESELECT");
      removeFromSelectedPhotos(photo.id);
    } else {
      console.log("SELCT");
      addToSelectedPhotos(photo.id);
    }
  };

  useEffect(() => {
    // if the assignMode if false, set photoSlected to false
    if (!assignMode) setPhotoSelected(false);
  }, [assignMode]);

  useEffect(() => {
    const mouseDown = () => {
      const timerId = setTimeout(() => {
        // Entering assign mode here, will select when timer ends
        enableAssignMode();
        timerRef.current = 0;
      }, 1600);
      timerRef.current = Number(timerId);
      console.log("timerId", Number(timerId));
      //clearTimeout(timerRef.current);
      console.log("timer after clear", timerRef.current);
    };

    const mouseUp = () => {
      console.log("Photo Click Up", assignMode);
      if (timerRef.current && !assignMode) {
        // If not in assign mode then got to full size image
        console.log("GO TO FULL SIZE IMAGE", assignMode);
        setFullSizePhotoOpen(true);
      } else if (timerRef.current && assignMode) {
        // If in assign, select image
        togglePhotoSelected();
        setPhotoSelected(!photoSelected);
        console.log("DO NOT GO TO FULL SIZE IMAGE");
      }
      window.clearTimeout(timerRef.current || 0);
    };
    const photoElement = photoRef.current;

    console.log("ADDDING EVEENT LISTENERS", photoElement);
    if (!photoElement) return;

    photoElement.addEventListener("mousedown", mouseDown);
    photoElement.addEventListener("mouseup", mouseUp);
    photoElement.addEventListener("touchstart", mouseDown);
    photoElement.addEventListener("touchend", mouseUp);
    photoElement.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    //element.addEventListener("mouseout", mouseUp)

    return () => {
      if (!!photoElement) {
        photoElement.removeEventListener("mousedown", mouseDown);
        photoElement.removeEventListener("mouseup", mouseUp);
        photoElement.removeEventListener("touchstart", mouseDown);
        photoElement.removeEventListener("touchend", mouseUp);
        photoElement.removeEventListener("contextmenu", function (event) {
          event.preventDefault();
        });
        //element.removeEventListener("mouseout", mouseUp);
      }
    };
  }, [
    assignMode,
    photoSelected,
    selectedPhotos,
    enableAssignMode,
    setFullSizePhotoOpen,
    togglePhotoSelected,
  ]);

  const removeFromSelectedPhotos = (photoId: string) => {
    console.log("selected photos", selectedPhotos);
    // This isnot working properyl
    const newSelectedPhotos = selectedPhotos.filter(function (selectedPhotoId) {
      return selectedPhotoId !== photoId;
    });
    console.log(newSelectedPhotos);
    setSelectedPhotos(newSelectedPhotos);
  };

  return (
    <button ref={photoRef} className="relative">
      <img className="" src={url} width={208} height={208} alt="image" />
      {photoSelected ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-sky-500/50"></div>
      ) : (
        <></>
      )}
    </button>
  );
};
