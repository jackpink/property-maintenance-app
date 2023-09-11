/*
    Will need to add a full size image popover, which lets   */
import Image from "next/image";
import { RouterOutputs, api } from '~/utils/api'
import Popover from "./Popover";
import { useState } from "react";

type Photo = RouterOutputs["photo"]["getUnassignedPhotosForJob"][number];

type Photos = RouterOutputs["photo"]["getUnassignedPhotosForJob"];

type Props = {
    photos: Photos
}

const Photos: React.FC<Props> = ({ photos }) => {

    return(
        <div className="flex flex-wrap gap-4 pt-8 justify-center">
            {photos.map((photo, index) => {
                return(
                    <Photo key={index} photo={photo} />
                )
            })}
        </div>
    )
}

export default Photos;

type PhotoProps = {
    photo: Photo
}


const Photo: React.FC<PhotoProps> = ({ photo }) => {
    const [ fullSizePhotoOpen, setFullSizePhotoOpen] = useState(false);
    const {data: url} = api.photo.getPhoto.useQuery({name: photo.filename, type: "sm"})
    console.log("get photo url ", url);
    if (typeof url !== 'string') return <>Loading</>
    return(
        <>
            <Popover popoveropen={fullSizePhotoOpen} setPopoverOpen={setFullSizePhotoOpen}>
                <FullSizePhoto photo={photo} />
            </Popover>
                <Image src={url} width={220} height={220} alt="image" onClick={() => setFullSizePhotoOpen(true)}/>
        </>
    )
}

const FullSizePhoto: React.FC<PhotoProps> = ({ photo }) => {
    const {data: url} = api.photo.getPhoto.useQuery({name: photo.filename, type: "full"})
    if (typeof url !== 'string') return <>Loading</>
    return(
         <Image src={url} width={300} height={300} alt="image" />
    )
}