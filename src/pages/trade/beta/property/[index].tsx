import { RouterOutputs, api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { concatAddress } from "~/components/Properties/Property";
import { useEffect, useRef, useState } from "react";
// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

type AddRoomTextInputProps = {
    ToggleTextboxOpen: any
}

const AddRoomTextInput: React.FC<AddRoomTextInputProps> = ({ ToggleTextboxOpen }) => {
    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if( ref.current && !ref.current.contains(event.target)) {
                console.log("toggle open")
                ToggleTextboxOpen();
                // toggle current
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    return(
        <div ref={ref} className="w-full flex">
            <input className="w-full p-2 text-slate-900 font-extrabold"/>
            <button className="p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300">+</button>
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

