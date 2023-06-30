import { RouterOutputs, api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import clsx from 'clsx';
import { concatAddress } from "~/components/Properties/Property";
import { useEffect, useRef, useState } from "react";
import { z } from 'zod';

// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

type AddRoomTextInputProps = {
    ToggleTextboxOpen: any
}

const ValidRoomInput = z.string().min(5, { message: "Must be 5 or more characters long" }).max(30, {message: "Must be less than 30 characters"});

const AddRoomTextInput: React.FC<AddRoomTextInputProps> = ({ ToggleTextboxOpen }) => {

    const [roomNameInput, setRoomNameInput] = useState('');
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

    const AddRoomClickEvent = (event: any) => {
        // Check The Room input for correctness
        console.log(roomNameInput);
        const checkRoomInput = ValidRoomInput.safeParse(roomNameInput);
        console.log(checkRoomInput);
        if (!checkRoomInput.success) {
            console.log("throw error onm input");
        } else {
            console.log("add room ", roomNameInput);
        }
        // Then try to add room via trpc
    }

    return(
        <div className="w-full ">
            <div ref={ref} className="flex">
                <input onChange={e => setRoomNameInput(e.target.value)} className="w-full p-2 text-slate-900 font-extrabold"/>
                <button onClick={AddRoomClickEvent} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+</button>
            </div>
            {error ? (<p className="text-red-500">⚠️ {errorMessage}</p>) : null}
        </div>
    )
}

const AddRoomButton = () => {
    const [textboxOpen, setTextboxOpen] = useState(false);
    const ToggleTextboxOpen = () => {
        //toggle textboxOpen
        setTextboxOpen(!textboxOpen);
    }
    if (textboxOpen) {
        return(
            <AddRoomTextInput ToggleTextboxOpen={ToggleTextboxOpen}/>
        )
    }
    return(
        <button onClick={ToggleTextboxOpen} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+ Add Room</button>
    )
}


type Level = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"][number]

type LevelProps = {
    level: Level
}

const Level: React.FC<LevelProps> = ({ level }) => {

    return(
        <div className=" text-center bg-black/20 w-60 rounded-lg">
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 bg-black/10" >{level.label}</h2>
            <div className="grid grid-cols-1 p-2 gap-2">
                {level.rooms.map((room, index) => {
                    return(
                        <p className="rounded  p-2 text-slate-900 font-extrabold text-xl" key={index} >{room.label}</p>
                    )
                })}
            
                <AddRoomButton />
            </div>
        </div>
    )
}

type AddLevelTextInputProps = {
    ToggleTextboxOpen: any
}

const ValidLevelInput = z.string().min(5, { message: "Must be 5 or more characters long" }).max(30, {message: "Must be less than 30 characters"});

const AddLevelTextInput: React.FC<AddLevelTextInputProps> = ({ ToggleTextboxOpen }) => {

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
        }
        // Then try to add room via trpc
    }

    return(
        <div className="text-center bg-black/30 w-60 h-30 rounded-lg p-6">
            <div ref={ref} className={clsx("flex")}>
                <input onChange={e => setLevelNameInput(e.target.value)} className={clsx("w-full p-2 text-slate-900 font-extrabold outline-none", {"border border-2 border-red-500": error})}/>
                <button onClick={AddLevelClickEvent} className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+</button>
            </div>
            {error ? (<p className="text-red-500">⚠️ {errorMessage}</p>) : null}
        </div>
    )
}

const AddLevelButton = () => {
    const [textboxOpen, setTextboxOpen] = useState(false);
    const ToggleTextboxOpen = () => {
        //toggle textboxOpen
        setTextboxOpen(!textboxOpen);
    }
    if (textboxOpen) {
        return(
            <AddLevelTextInput ToggleTextboxOpen={ToggleTextboxOpen}/>
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
    const address = concatAddress(property);
    return(
        <>
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            <div className="flex flex-wrap gap-3 justify-center">
                {property.levels.map((level, index) => {
                    return(
                        <Level level={level} key={index} />
                    )
                })}
                <AddLevelButton />
            </div>
        </>
    )
}

type TradePropertyPageWithUserProps = {
    userId: string,
    propertyId: string
}

const TradePropertyPageWithUser: React.FC<TradePropertyPageWithUserProps> = ({ userId, propertyId }) => {
    const property = api.property.getPropertyForTradeUser.useQuery({id: propertyId, user: userId});
    if (!property.data) return <>Loading</>
    return(
        <EditProperty property={property.data} />
    )
}

const TradePropertyPage = ()  => {
    const { userId } = useAuth();
    const id = useRouter().query.index?.toString(); 
    console.log(userId);
    if (!userId || !id) {
        return <>Loading</>
    }
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    
    return(
        <TradePropertyPageWithUser userId={userId} propertyId={id} />
    )
    

}

export default TradePropertyPage;

