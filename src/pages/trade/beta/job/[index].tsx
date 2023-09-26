import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import { concatAddress } from "~/components/Properties/Property";
import Link from "next/link";
import Image from "next/image";
import house from '../../../../images/demo-page/house-stock-image.png';
import Button from "~/components/Button";
import Popover from "~/components/Popover";
import Photos from "~/components/JobPhotos";
import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useState } from "react";
import clsx from "clsx";
import axios from "axios";

type PhotoViewerProps = {
    job: Job
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ job }) => {
    const [selectedRoom, setSelectedRoom] = useState("UNASSIGNED"); 
    return(
        <div className="text-center	">
            <select 
                className="border-solid border-2 border-black p-3 rounded-full text-center	"
                value={selectedRoom}
                onChange={e => setSelectedRoom(e.target.value)}
            >
                <option value="UNASSIGNED">UNASSIGNED</option>
                {job.rooms.map((room, index) => {
                    return(
                        <option key={index} value={room.id}>{room.Level.label.toUpperCase() + "→" +room.label.toUpperCase()}</option>
                    )
                })}
                
            </select>
            {(selectedRoom==="UNASSIGNED") ? <UnassignedPhotos job={job}/> : <RoomPhotos job={job} roomId={selectedRoom}/>}
            
        </div>
    )

}


type UnassignedPhotosProps = {
    job: Job
}


const UnassignedPhotos: React.FC<UnassignedPhotosProps> = ({ job }) => {
    const { data: photos } = api.photo.getUnassignedPhotosForJob.useQuery({jobId: job.id})

    if (!!photos && photos.length>0) {
        console.log(photos);
        return(
            <div>
                <Photos photos={photos} rooms={job.rooms} />
            </div>
        )
        

    }
    return(
    <>
        no photo
    </>
    )
}

type RoomPhotosProps = {
    job: Job,
    roomId: string
}

const RoomPhotos: React.FC<RoomPhotosProps> = ({ job, roomId }) => {
    const { data: photos } = api.photo.getPhotosForJobAndRoom.useQuery({jobId: job.id, roomId: roomId})

    if (!!photos && photos.length>0) {
        console.log(photos);
        return(
            <>
                <Photos photos={photos} rooms={job.rooms} />
            </>
        )
        

    }
    return(
    <p>
        no photos
    </p>
    )
}


type UploadPhotoButtonProps = {
    job: Job
}

const UploadPhotoButton: React.FC<UploadPhotoButtonProps> = ({ job }) => {
    
    const { mutateAsync: getPresignedUrl } = api.photo.getPhotoUploadPresignedUrl.useMutation();

    const { mutateAsync: createPhotoRecord } = api.photo.createPhotoRecord.useMutation();

    const ctx = api.useContext();

    const uploadPhotoToSignedURL = async (signedUrl :string, file: File ) => {
        const result = await axios 
            .put(signedUrl, file.slice(), {
                headers: {"Content-Type": file.type},
            })
            .then((response) => {
                console.log(response);
                console.log("Successfully Uploaded ", file.name);
                return true;
            })
            .catch((err) => {
                console.log(err)
                return false;
            });
        return result;
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {      
        const files = event.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            for (const file of fileArray) {
            //for (let i = 0; i < files.length; i++) {
                console.log(job.Property.id)
                // Need to check that file is correct type (ie jpeg/png/tif/etc)
                const { url, filename } = await getPresignedUrl({key: file.name, property: job.Property.id})
                console.log("URL", url)
                // upload file
                const uploadSuccess = await uploadPhotoToSignedURL(url, file);
                // if successful add photo record to db for lookup (relabelling photo?)
                if (uploadSuccess) {
                    console.log("Add photo to db");
                    void createPhotoRecord({ filename: filename, jobId: job.id }).then(() => {
                        // refetch of photos
                        void ctx.photo.getUnassignedPhotosForJob.invalidate();
                    });
                    
                }
            }
        }
    }

    

    return(
        <>
            <label htmlFor="photo-upload-input" className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300  place-self-center">Upload Photo</label>
            <input onChange={handleFileChange} multiple type="file" id="photo-upload-input" className="opacity-0"/>
        </>
    )
}

type RoomFromLevels = RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number]["rooms"][number];

type RoomButtonProps = {
    className: string
    room: RoomFromLevels
    job: Job,
    closePopover: () => void,
    setRemoveError: Dispatch<SetStateAction<boolean>>
}

const checkRoomIsSelectedRoom = (room: RoomFromLevels, selectedRooms: RoomFromLevels[]) => {
    
    
    const result = selectedRooms.find((selectedRoom) => selectedRoom.id === room.id )
    return result;
}

export const RoomButton: React.FC<RoomButtonProps> = ({ className, room, job, closePopover, setRemoveError }) => {
    
    const ctx = api.useContext()

    const { mutate: addRoomToJob } = api.job.addRoomToJob.useMutation({
        onSuccess: () => {
            // Refetch job for page
            void ctx.job.getJobForTradeUser.invalidate();
            // close popover
            closePopover();
            
        }
    });

    const { mutate: removeRoomFromJob } = api.job.removeRoomFromJob.useMutation({
        onSuccess: () => {
            // Refetch job for page
            setRemoveError(false);
            void ctx.job.getJobForTradeUser.invalidate();
            // close popover
            closePopover();
            
        }, onError: (error) => {
            console.log(error);
            setRemoveError(true);
        }
    });
    
    const addRoomButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Add room to job mutation
        addRoomToJob({jobId: job.id, roomId: event.currentTarget.value})
        console.log("new room added to job");
    }
    const removeRoomButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Add room to job mutation
        removeRoomFromJob({jobId: job.id, roomId: event.currentTarget.value})
    }
    if ( checkRoomIsSelectedRoom(room, job.rooms) ) {
        return(
            <button onClick={removeRoomButtonClicked} value={room.id} className={clsx(className, "border-2 rounded border-teal-800 bg-teal-300 p-2")}  >{room.label}</button>
        )
    }
    return(
        <button value={room.id} onClick={addRoomButtonClicked} className={clsx(className, "border rounded border-teal-800 p-2")} >{room.label}</button>
    )
}

type Level = RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number]

type LevelProps = {
    level: Level,
    job: Job
    closePopover: () => void,
    setRemoveError: Dispatch<SetStateAction<boolean>>

}

export const Level: React.FC<LevelProps> = ({ level, job, closePopover, setRemoveError }) => {
    return(
        <div className="text-center w-60">
            <h1>{level?.label}</h1>
            {level?.rooms.map((room, index) => 
                <div key={index} className="grid grid-cols-1 gap-2 p-2">
                    <RoomButton className="" key={index} room={room} job={job} closePopover={closePopover} setRemoveError={setRemoveError}/>
                </div>
            )}
        </div>
    )
}

type RoomSelectorProps = {
    job: Job
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ job }) => {
    const [removeError, setRemoveError] = useState(false);
    const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

    useEffect(() => {
        if (roomSelectorOpen === false) setRemoveError(false);
    }, [roomSelectorOpen]);

    const closePopover = () => {
        setRoomSelectorOpen(false);
        setRemoveError(false);
    }    


    return(
        <div className="grid">
            <Button onClick={() => setRoomSelectorOpen(true)} className="w-48 place-self-center my-6">Select Rooms</Button>
            <Popover popoveropen={roomSelectorOpen} setPopoverOpen={setRoomSelectorOpen}>
                <div className="flex flex-wrap gap-3 justify-center">
                {job.Property.levels.map((level, index) => {
                    return(
                        <Level level={level} key={index} job={job} closePopover={closePopover} setRemoveError={setRemoveError}/>
                    )
                })}
                </div>
                {(removeError)?(
                    <p className="text-red-500">⚠️ You cannot remove room which has photos linked to it, please remove photos first</p>
                ):(<></>)}
            </Popover>
        </div>
    )
}

type Property = RouterOutputs["job"]["getJobForTradeUser"]["Property"]

type PropertyProps = {
    job: Job
}

 const Property: React.FC<PropertyProps>= ({ job }) => {
    const address = concatAddress(job.Property)
    const rooms = job.rooms;
    return(
        <Link href={`/trade/beta/property/${job.Property.id}`} className="w-3/4 md:w-1/2 place-self-center">        
        <div className="grid grid-cols-3 border-solid border-2 border-teal-800 rounded-xl hover:bg-black/20" >
            <Image 
            alt="House Stock Image"
            src={house} 
            className="min-w-xl p-3 rounded-xl"/>
            <div className="col-span-2 relative">
                <h1 className="text-slate-900 font-extrabold text-lg lg:text-2xl p-3">{address}</h1>
                {rooms.map((room, index) => {
                    return(
                        <p className="text-xs font-light text-slate-600" key={index}>{room.Level.label.toUpperCase() + "→" +room.label.toUpperCase()}</p>
                    )
                })}
            </div>
        </div>
        </Link>

    );
 }

type Job = RouterOutputs["job"]["getJobForTradeUser"];

type TradeJobPageWithJobProps = {
    job: Job
}

const TradeJobPageWithJob: React.FC<TradeJobPageWithJobProps> = ({ job }) => {
    const address = concatAddress(job.Property);

    return(
        <div className="grid justify-center">
            <p className="place-self-center">{job.date.toDateString()}</p>
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{job.title}</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">{address}</h2>
            <Property job={job} />
            <RoomSelector job={job} />
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Notes</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Documents</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Photos</h2>
            <UploadPhotoButton job={job} />
            <PhotoViewer job={job}/>
            
            
        </div>
    )
}

type TradeJobPageWithParamsProps = {
    id: string
}

const TradeJobPageWithParams: React.FC<TradeJobPageWithParamsProps> = ({ id }) => {

    const job = api.job.getJobForTradeUser.useQuery({jobId: id});

    if (!job.data) return <>Loading</> 

    return(
        <TradeJobPageWithJob job={job.data} />
    )
}


const TradeJobPage = ()  => {

    const id = useRouter().query.index?.toString(); 
    
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    if (!id) return <>loading</>

    return(
        <TradeJobPageWithParams  id={id} />
    )
    

}

export default TradeJobPage;