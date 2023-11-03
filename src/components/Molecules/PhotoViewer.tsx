/*
    Will need to add a full size image popover, which lets   */
import { type RouterOutputs, api } from "~/utils/api";
import Popover from "../Atoms/Popover";
import { useState } from "react";
import LoadingSpinner from "../Atoms/LoadingSpinner";

type Photo = RouterOutputs["photo"]["getUnassignedPhotosForJob"][number];

type Photos = RouterOutputs["photo"]["getUnassignedPhotosForJob"];

type PhotoViewerProps = {
  photos: Photos;
};

const PhotoViewer: React.FC<PhotoViewerProps> = ({ photos }) => {
  return (
    <div className="flex  flex-wrap justify-center gap-4 pt-8">
      {photos.map((photo, index, photoArray) => {
        return (
          <Photo
            key={index}
            photo={photo}
            index={index}
            photoArray={photoArray}
          />
        );
      })}
    </div>
  );
};

type PhotoProps = {
  photo: Photo;
  index: number;
  photoArray: Photo[];
};

const Photo: React.FC<PhotoProps> = ({ photo, index, photoArray }) => {
  const [fullSizePhotoOpen, setFullSizePhotoOpen] = useState(false);
  const { data: url } = api.photo.getPhoto.useQuery({
    name: photo.filename,
    type: "sm",
  });

  const photoLoading = typeof url !== "string";
  //if (typeof url !== "string") return <>Loading</>;
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
          <button onClick={() => setFullSizePhotoOpen(true)}>
            <img src={url} width={208} height={208} alt="image" />
          </button>
        </>
      )}
    </>
  );
};

type FullSizePhotoProps = {
  index: number;
  photoArray: Photo[];
};

export const FullSizePhoto: React.FC<FullSizePhotoProps> = ({
  index,
  photoArray,
}) => {
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
      <div className="relative flex justify-center">
        <button
          onClick={() => setPhotoIndex((photoIndex - 1) % photoArray.length)}
        >
          <svg
            fill="#a39f9f"
            className="absolute left-0 self-center hover:fill-blue-500"
            height="100px"
            width="100px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 493.468 493.468"
            stroke="#a39f9f"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
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
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
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
          className="h-auto w-full justify-self-center 2xl:w-208"
        />
      </div>
    </div>
  );
};
export default PhotoViewer;
