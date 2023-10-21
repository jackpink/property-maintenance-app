/*
Will need to add a full size image popover, which lets   */
import { type RouterOutputs, api } from "~/utils/api";
import Popover from "./Popover";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "./Button";

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
              <Button
                onClick={click}
                value={room.id}
                className="my-4 md:w-96"
                key={index}
              >
                {room.Level.label.toUpperCase() +
                  "→" +
                  room.label.toUpperCase()}
              </Button>
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
            <Button
              onClick={() => setRoomAssignButtonsOpen(true)}
              className="w-2/3 p-6"
            >
              Move to Room
            </Button>
            <Button onClick={exitAssignMode} className="ml-5 p-6">
              X
            </Button>
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

  if (typeof url !== "string") return <div className="">Loading</div>; ///THIS Is why ref is null, look into lazy loading with next
  return (
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
      <img className="" src={url} width={220} height={220} alt="image" />
      {photoSelected ? (
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-sky-500/50"></div>
      ) : (
        <></>
      )}
    </button>
  );
};

type FullSizePhotoProps = {
  index: number;
  photoArray: Photo[];
};

const FullSizePhoto: React.FC<FullSizePhotoProps> = ({ index, photoArray }) => {
  const [photoIndex, setPhotoIndex] = useState(index);
  const photo = photoArray.at(photoIndex);
  if (!photo) return <>Not found</>;
  const { data: url } = api.photo.getPhoto.useQuery({
    name: photo.filename,
    type: "full",
  });
  if (typeof url !== "string") return <>Loading</>;
  return (
    <div>
      <div className="h-6"></div>
      <div className="relative flex">
        <button
          onClick={() => setPhotoIndex((photoIndex - 1) % photoArray.length)}
        >
          <svg
            fill="#a39f9f"
            className="absolute self-center hover:fill-blue-500"
            height="100px"
            width="100px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 493.468 493.468"
            stroke="#a39f9f"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <g>
                  {" "}
                  <path d="M246.736,0C110.688,0,0.008,110.692,0.008,246.732c0,136.056,110.68,246.736,246.728,246.736 S493.46,382.788,493.46,246.732C493.46,110.692,382.784,0,246.736,0z M197.592,249.536l94.764,94.776 c1.012,1.004,1.568,2.348,1.568,3.776c0,1.448-0.556,2.784-1.568,3.772l-8.96,8.98c-2.004,2.004-5.568,2.012-7.568,0 l-110.14-110.136c-1.008-1.016-1.556-2.38-1.54-3.932c-0.016-1.476,0.532-2.828,1.536-3.852l110.312-110.304 c1.004-1.004,2.34-1.56,3.776-1.56c1.424,0,2.788,0.556,3.78,1.56l8.968,8.98c2.1,2.06,2.1,5.468,0.004,7.548l-94.932,94.944 C196.084,245.592,196.084,248.024,197.592,249.536z"></path>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
        </button>
        <button
          onClick={() => setPhotoIndex((photoIndex + 1) % photoArray.length)}
        >
          <svg
            fill="#a39f9f"
            className="absolute right-0 self-center hover:fill-blue-500"
            height="100px"
            width="100px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 493.468 493.468"
            stroke="#a39f9f"
            transform="matrix(-1, 0, 0, -1, 0, 0)"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <g>
                  {" "}
                  <path d="M246.736,0C110.688,0,0.008,110.692,0.008,246.732c0,136.056,110.68,246.736,246.728,246.736 S493.46,382.788,493.46,246.732C493.46,110.692,382.784,0,246.736,0z M197.592,249.536l94.764,94.776 c1.012,1.004,1.568,2.348,1.568,3.776c0,1.448-0.556,2.784-1.568,3.772l-8.96,8.98c-2.004,2.004-5.568,2.012-7.568,0 l-110.14-110.136c-1.008-1.016-1.556-2.38-1.54-3.932c-0.016-1.476,0.532-2.828,1.536-3.852l110.312-110.304 c1.004-1.004,2.34-1.56,3.776-1.56c1.424,0,2.788,0.556,3.78,1.56l8.968,8.98c2.1,2.06,2.1,5.468,0.004,7.548l-94.932,94.944 C196.084,245.592,196.084,248.024,197.592,249.536z"></path>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
        </button>
        <img
          src={url}
          width="0"
          height="0"
          alt="image"
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
};
