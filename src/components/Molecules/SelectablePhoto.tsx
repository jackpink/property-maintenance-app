import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Photo } from "./PhotosViewerWithRoomSelector";

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
      }, 600);
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

export default SelectablePhoto;
