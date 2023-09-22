/*
    Will need to add a full size image popover, which lets   */
    import Image from "next/image";
    import { RouterOutputs, api } from '~/utils/api'
    import Popover from "./Popover";
    import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
    import { clearTimeout } from "timers";
import Button from "./Button";
import ClickAwayListener from "./ClickAwayListener";
    
    type Photo = RouterOutputs["photo"]["getUnassignedPhotosForJob"][number];
    
    type Photos = RouterOutputs["photo"]["getUnassignedPhotosForJob"];
    
    type Props = {
        photos: Photos
    }
    
    const Photos: React.FC<Props> = ({ photos }) => {
        const [assignMode, setAssignMode ] = useState(false);

    
        return(
            <ClickAwayListener clickOutsideAction={() => setAssignMode(false)} >
                <div className="flex flex-wrap gap-4 pt-8 justify-center">
                    {photos.map((photo, index, photoArray) => {
                        return(
                            <Photo key={index} photo={photo} index={index} photoArray={photoArray} assignMode={assignMode} setAssignMode={setAssignMode}/>
                        )
                    })}
                    {(assignMode) ? (
                        <div className="fixed bottom-6 w-full">
                            <Button className="p-6 w-2/3">Move to Room</Button>
                            <Button onClick={() => setAssignMode(false)} className="p-6 ml-5">X</Button>
                        </div>
                        ) : (
                            <></>
                        )}
                </div>
            </ClickAwayListener>
        )
    }
    
    export default Photos;
    
    
    type PhotoProps = {
        photo: Photo
        index: number,
        photoArray: Photo[],
        assignMode: boolean,
        setAssignMode: Dispatch<SetStateAction<boolean>>
    }
    
    
    const Photo: React.FC<PhotoProps> = ({ photo, index, photoArray, assignMode, setAssignMode }) => {
        const [ fullSizePhotoOpen, setFullSizePhotoOpen] = useState(false);
        const [ photoSelected, setPhotoSelected ] = useState(false);
        const photoRef = useRef<HTMLButtonElement>(null);
        const timerRef = useRef<number>(0);
        const {data: url} = api.photo.getPhoto.useQuery({name: photo.filename, type: "sm"})
        
        useEffect(() => {
            // if the assignMode if false, set photoSlected to false
            if (!assignMode) setPhotoSelected(false);
        }, [assignMode])

        const enableAssignMode = () => {
            setAssignMode(true);
            setPhotoSelected(true)

        }

        const mouseDown = () => {
            const timerId = setTimeout(() => {
                // Entering assign mode here, will select when timer ends
                enableAssignMode();
                timerRef.current = 0;
            }, 400);
            timerRef.current = Number(timerId);
            console.log("timerId", Number(timerId))
            //clearTimeout(timerRef.current);
            console.log("timer after clear", timerRef.current);
        }
    
        const mouseUp = () => {
            console.log("Photo Click Up", timerRef);
            if (timerRef.current && !assignMode){
                // If not in assign mode then got to full size image
                console.log("GO TO FULL SIZE IMAGE")
                setFullSizePhotoOpen(true);
            } else if (timerRef.current && assignMode) {
               // If in assign, select image
               setPhotoSelected(true);
               console.log("DO NOT GO TO FULL SIZE IMAGE")
            }
            window.clearTimeout(timerRef.current || 0);
           
        }
        useEffect(() => {
            const element = photoRef.current;
           
            if (!!element) {
                element.addEventListener("mousedown", mouseDown)
                element.addEventListener("mouseup", mouseUp)
                //element.addEventListener("mouseout", mouseUp)
            }
    
            return () => {
                if (!!element) {
                    element.removeEventListener("mousedown", mouseDown);
                    element.removeEventListener("mouseup", mouseUp);
                    //element.removeEventListener("mouseout", mouseUp);
                }
            }
        }, []);
    
        console.log("get photo url ", url);
    
        if (typeof url !== 'string') return <>Loading</>
        return(
            <>
                <Popover popoveropen={fullSizePhotoOpen} setPopoverOpen={setFullSizePhotoOpen}>
                    <FullSizePhoto index={index} photoArray={photoArray} />
                </Popover>
                <button ref={photoRef} className="relative">
                    <Image className="" src={url} width={220} height={220} alt="image" />
                    {(photoSelected) ? (
                            <div className="absolute bg-sky-500/50 top-0 left-0 right-0 bottom-0"></div>
                        ) : (
                            <></>
                    )}
                </button>
            </>
        )
    }
    
    type FullSizePhotoProps = {
        index: number,
        photoArray: Photo[]
    }
    
    const FullSizePhoto: React.FC<FullSizePhotoProps> = ({ index, photoArray }) => {
        const [photoIndex, setPhotoIndex] = useState(index);
        const {data: url} = api.photo.getPhoto.useQuery({name: photoArray.at(photoIndex)?.filename, type: "full"})
        if (typeof url !== 'string') return <>Loading</>
        return(
            <div>
                <div className="h-6"></div>
                <div className="relative flex">
                    <button onClick={() => setPhotoIndex((photoIndex - 1)%photoArray.length)}><svg fill="#a39f9f" className="absolute self-center hover:fill-blue-500" height="100px" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 493.468 493.468" stroke="#a39f9f"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M246.736,0C110.688,0,0.008,110.692,0.008,246.732c0,136.056,110.68,246.736,246.728,246.736 S493.46,382.788,493.46,246.732C493.46,110.692,382.784,0,246.736,0z M197.592,249.536l94.764,94.776 c1.012,1.004,1.568,2.348,1.568,3.776c0,1.448-0.556,2.784-1.568,3.772l-8.96,8.98c-2.004,2.004-5.568,2.012-7.568,0 l-110.14-110.136c-1.008-1.016-1.556-2.38-1.54-3.932c-0.016-1.476,0.532-2.828,1.536-3.852l110.312-110.304 c1.004-1.004,2.34-1.56,3.776-1.56c1.424,0,2.788,0.556,3.78,1.56l8.968,8.98c2.1,2.06,2.1,5.468,0.004,7.548l-94.932,94.944 C196.084,245.592,196.084,248.024,197.592,249.536z"></path> </g> </g> </g></svg></button>
                    <button onClick={() => setPhotoIndex((photoIndex + 1)%photoArray.length)}><svg fill="#a39f9f" className="absolute self-center right-0 hover:fill-blue-500" height="100px" width="100px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 493.468 493.468" stroke="#a39f9f" transform="matrix(-1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M246.736,0C110.688,0,0.008,110.692,0.008,246.732c0,136.056,110.68,246.736,246.728,246.736 S493.46,382.788,493.46,246.732C493.46,110.692,382.784,0,246.736,0z M197.592,249.536l94.764,94.776 c1.012,1.004,1.568,2.348,1.568,3.776c0,1.448-0.556,2.784-1.568,3.772l-8.96,8.98c-2.004,2.004-5.568,2.012-7.568,0 l-110.14-110.136c-1.008-1.016-1.556-2.38-1.54-3.932c-0.016-1.476,0.532-2.828,1.536-3.852l110.312-110.304 c1.004-1.004,2.34-1.56,3.776-1.56c1.424,0,2.788,0.556,3.78,1.56l8.968,8.98c2.1,2.06,2.1,5.468,0.004,7.548l-94.932,94.944 C196.084,245.592,196.084,248.024,197.592,249.536z"></path> </g> </g> </g></svg></button>
                    <Image src={url} width="0" height="0" alt="image" sizes="100vw" className="w-full h-auto" />
                </div>
            </div>
        )
    }