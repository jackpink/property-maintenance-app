import { RouterOutputs, api } from "~/utils/api";
import clsx from 'clsx';
import { useEffect, useRef, useState } from "react";
import { boolean, z } from 'zod';
import Image from "next/image";

// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

type AddRoomTextInputProps = {
    ToggleTextboxOpen: any,
    levelId: string
}

const ValidRoomInput = z.string().min(5, { message: "Must be 5 or more characters long" }).max(30, {message: "Must be less than 30 characters"});

const AddRoomTextInput: React.FC<AddRoomTextInputProps> = ({ ToggleTextboxOpen, levelId }) => {

    const [roomNameInput, setRoomNameInput] = useState('');
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('Error');

    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if( ref.current && !ref.current.contains(event.target)) {
                ToggleTextboxOpen();
                // toggle current
                setError(false);
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    const ctx = api.useContext();

    const { mutate: createRoom, isLoading: isCreatingRoom } = api.property.createRoomForLevel.useMutation({
        onSuccess: () => {
            // toggle the textbox open
            ToggleTextboxOpen();
            // refetch our property
            void ctx.property.getPropertyForTradeUser.invalidate();
        }
    });

    const addRoomClickEvent = (event: any) => {
        // Check The Room input for correctness
        const checkAddRoomInput = ValidRoomInput.safeParse(roomNameInput);
        if (!checkAddRoomInput.success) {
            console.log("throw error onm input");
            const errorFormatted = checkAddRoomInput.error.format()._errors.pop()
            if (!!errorFormatted) setErrorMessage(errorFormatted);
            setError(true);
        } else {
            console.log("add room ", roomNameInput);
            createRoom({
                label: roomNameInput,
                levelId: levelId
            })
        }        
    }

    return(
        <div className="w-full ">
            <div ref={ref} className="flex">
                <input onChange={e => setRoomNameInput(e.target.value)} disabled={isCreatingRoom} className={clsx("w-full p-2 text-slate-900 font-extrabold outline-none", {"border border-2 border-red-500": error})}/>
                <button onClick={addRoomClickEvent} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+</button>
            </div>
            {error ? (<p className="text-red-500">⚠️ {errorMessage}</p>) : null}
        </div>
    )
}

type AddRoomButtonProps = {
    levelId: string
}

const AddRoomButton: React.FC<AddRoomButtonProps>= ({ levelId }) => {
    const [textboxOpen, setTextboxOpen] = useState(false);
    const ToggleTextboxOpen = () => {
        //toggle textboxOpen
        setTextboxOpen(!textboxOpen);
    }
    if (textboxOpen) {
        return(
            <AddRoomTextInput ToggleTextboxOpen={ToggleTextboxOpen} levelId={levelId} />
        )
    }
    return(
        <button onClick={ToggleTextboxOpen} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+ Add Room</button>
    )
}
type Room = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"][number]["rooms"][number];

type RoomProps = {
    room: Room,
    editPropertyMode: boolean
}

const Room: React.FC<RoomProps> = ({ room, editPropertyMode }) => {

    const [editLabelMode, setEditLabelMode] = useState(false);
    const [editLabelInput, setEditLabelInput] = useState(room.label);

    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('Error');

    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if( ref.current && !ref.current.contains(event.target)) {
                setEditLabelMode(false);
                setEditLabelInput(room.label);
                setError(false);
                // toggle current
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    const ctx = api.useContext();

    const { mutate: updateRoom, isLoading: isUpdatingRoom } = api.property.updateRoomLabel.useMutation({
        onSuccess: () => {
            // toggle the textbox open
            setEditLabelMode(false);
            // refetch our property
            void ctx.property.getPropertyForTradeUser.invalidate();
        }
    });

    const cancelEditLabelMode = () => {
        setEditLabelMode(false);
        setEditLabelInput(room.label);
        setError(false);
        console.log("room label set to", room.label)
    }

    const updateRoomClickEvent = (event: any) => {
        // Check The Room input for correctness
        const checkEditRoomInput = ValidRoomInput.safeParse(editLabelInput);
        if (!checkEditRoomInput.success) {
            console.log("throw error onm input");
            const errorFormatted = checkEditRoomInput.error.format()._errors.pop()
            if (!!errorFormatted) setErrorMessage(errorFormatted);
            setError(true);
        } else {
            console.log("add room ", editLabelInput);
            updateRoom({
                newLabel: editLabelInput,
                roomId: room.id
            })
        }        
    }

    return(
        <>
        <div className="flex justify-center">
            {editLabelMode ? (
                <div ref={ref} className="flex">
                    <input value={editLabelInput} onChange={e => setEditLabelInput(e.target.value)} disabled={isUpdatingRoom} className={clsx("w-full p-2 text-slate-900 font-extrabold outline-none", {"border border-2 border-red-500": error})} />
                    <button onClick={cancelEditLabelMode} className="px-1"><Image src="/cancel.svg" alt="Edit" width={40} height={40} /></button>
                    <button onClick={updateRoomClickEvent} className="px-1"><Image src="/check_circle.svg" alt="Edit" width={40} height={40} /></button>
                </div>
            ) : (
                <>
                    <p className="rounded  p-2 text-slate-900 font-extrabold text-xl" >{room.label}</p>
                    {editPropertyMode ? (
                        <button onClick={() => setEditLabelMode(true)} className="pr-6"><Image src="/edit_button.svg" alt="Edit" width={30} height={30} /></button>
                    ) : (null)}
                </>
            )}
            
        </div>
        {error ? (<p className="text-red-500">⚠️ {errorMessage}</p>) : null}
        </>
    )
}

type Level = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"][number]

type LevelProps = {
    level: Level,
    editPropertyMode: boolean
}

const Level: React.FC<LevelProps> = ({ level, editPropertyMode }) => {

    const [editLabelMode, setEditLabelMode] = useState(false);
    const [editLabelInput, setEditLabelInput] = useState(level.label);

    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('Error');

    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if( ref.current && !ref.current.contains(event.target)) {
                setEditLabelMode(false);
                setEditLabelInput(level.label);
                setError(false);
                // toggle current
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    const ctx = api.useContext();

    const { mutate: updateLevel, isLoading: isUpdatingLevel } = api.property.updateLevelLabel.useMutation({
        onSuccess: () => {
            // toggle the textbox open
            setEditLabelMode(false);
            // refetch our property
            void ctx.property.getPropertyForTradeUser.invalidate();
        }
    });


    const cancelEditLabelMode = () => {
        setEditLabelMode(false);
        setEditLabelInput(level.label);
        setError(false);
    }

    const updateLevelClickEvent = (event: any) => {
        // Check The Room input for correctness
        const checkEditLevelInput = ValidLevelInput.safeParse(editLabelInput);
        if (!checkEditLevelInput.success) {
            console.log("throw error onm input");
            const errorFormatted = checkEditLevelInput.error.format()._errors.pop()
            if (!!errorFormatted) setErrorMessage(errorFormatted);
            setError(true);
        } else {
            console.log("add room ", editLabelInput);
            updateLevel({
                newLabel: editLabelInput,
                levelId: level.id
            })
        }        
    }
    

    return(
        <div className=" text-center bg-black/20 w-60 rounded-lg">
            <div className="py-4 mb-6 bg-black/10 text-center">
                <div className="flex">
                {editLabelMode ? (
                    <div ref={ref} className="flex">
                        <input value={editLabelInput} onChange={e => setEditLabelInput(e.target.value)} disabled={false} className={clsx("w-full p-2 mx-2 text-slate-900 font-extrabold outline-none", {"border border-2 border-red-500": error}) }/>
                        <button onClick={cancelEditLabelMode} className="px-1"><Image src="/cancel.svg" alt="Edit" width={40} height={40} /></button>
                        <button onClick={updateLevelClickEvent} className="px-1"><Image src="/check_circle.svg" alt="Edit" width={40} height={40} /></button>
                    </div>
                ) : (
                    <>
                        <h2 className="font-sans text-slate-900 font-extrabold text-xl w-full" >{level.label}</h2>
                        {editPropertyMode ? (
                            <button onClick={() => setEditLabelMode(true)} className="pr-6"><Image src="/edit_button.svg" alt="Edit" width={30} height={30} /></button>
                        ) : (null)}
                    </>
                )}
                </div>
                {error ? (<p className="text-red-500">⚠️ {errorMessage}</p>) : null}
            </div>
            
            
            
            <div className="grid grid-cols-1 p-2 gap-2">
                {level.rooms.map((room, index) => {
                    return(
                        <Room room={room} key={index} editPropertyMode={editPropertyMode} />
                    )
                })}
            
                {editPropertyMode ? (null) : (
                    <AddRoomButton levelId={level.id} />
                )}
            </div>
        </div>
    )
}

type AddLevelTextInputProps = {
    ToggleTextboxOpen: any,
    propertyId: string
}

const ValidLevelInput = z.string().min(5, { message: "Must be 5 or more characters long" }).max(30, {message: "Must be less than 30 characters"});

const AddLevelTextInput: React.FC<AddLevelTextInputProps> = ({ ToggleTextboxOpen, propertyId }) => {

    const [levelNameInput, setLevelNameInput] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('Error');

    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if( ref.current && !ref.current.contains(event.target)) {
                ToggleTextboxOpen();
                // toggle current
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    const ctx = api.useContext();

    const {mutate: createLevel, isLoading: createLevelLoading} = api.property.createLevelForProperty.useMutation({
        onSuccess: () => {
            // toggle the textbox open
            ToggleTextboxOpen();
            // refetch our property
            void ctx.property.getPropertyForTradeUser.invalidate();
        }
    });

    const AddLevelClickEvent = (event: any) => {
        // Check The Room input for correctness
        const checkLevelInput = ValidLevelInput.safeParse(levelNameInput);
        if (!checkLevelInput.success) {
            console.log("throw error onm input");
            const errorFormatted = checkLevelInput.error.format()._errors.pop()
            if (!!errorFormatted) setErrorMessage(errorFormatted);
            setError(true);
        } else {
            console.log("add room ", levelNameInput);
            createLevel({
                label: levelNameInput,
                propertyId: propertyId
            })
        }        
    }

    return(
        <div className={clsx("text-center bg-black/30 w-60 h-24 rounded-lg p-6", {"h-32": error})} >
            <div ref={ref} className={clsx("flex")}>
                <input disabled={createLevelLoading} onChange={e => setLevelNameInput(e.target.value)} className={clsx("w-full p-2 text-slate-900 font-extrabold outline-none", {"border border-2 border-red-500": error})}/>
                <button onClick={AddLevelClickEvent} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+</button>
            </div>
            {error ? (<p className="text-red-500">⚠️ {errorMessage}</p>) : null}
        </div>
    )
}

type AddLevelButtonProps = {
    propertyId: string
}

const AddLevelButton: React.FC<AddLevelButtonProps> = ({ propertyId }) => {
    const [textboxOpen, setTextboxOpen] = useState(false);
    const ToggleTextboxOpen = () => {
        //toggle textboxOpen
        setTextboxOpen(!textboxOpen);
    }
    if (textboxOpen) {
        return(
            <AddLevelTextInput ToggleTextboxOpen={ToggleTextboxOpen} propertyId={propertyId} />
        )
    }
    return(
        <div className="text-center bg-black/30 w-60 h-24 rounded-lg py-6 ">
            <button onClick={ToggleTextboxOpen} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+ Add Level</button>
        </div>
    )
}

type Property = RouterOutputs["property"]["getPropertyForTradeUser"]

type EditPropertyProps = {
    property: Property
}

const EditProperty: React.FC<EditPropertyProps> = ({ property }) => {
    const [editPropertyMode, setEditPropertyMode] = useState(false);
    
    return(
        <>
            {editPropertyMode ? (
                <div className="flex justify-center">
                    <button onClick={() => setEditPropertyMode(false)} className="flex p-2 mb-8 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">Exit Edit Mode <Image src="/cancel.svg" alt="Edit" width={30} height={30} /></button>
                </div>
            ) : (
                <div className="flex justify-center">
                    <button onClick={() => setEditPropertyMode(true)} className="flex p-2 mb-8 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">Edit Property <Image src="/edit_button.svg" alt="Edit" width={30} height={30} /></button>
                </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
                {property.levels.map((level, index) => {
                    return(
                        <Level level={level} key={index} editPropertyMode={editPropertyMode} />
                    )
                })}
                {editPropertyMode ? (null) : (
                    <AddLevelButton propertyId={property.id} />
                )}
                
            </div>
        </>
    )
}

export default EditProperty