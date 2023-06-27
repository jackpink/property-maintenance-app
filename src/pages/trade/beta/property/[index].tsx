import { RouterOutputs, api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { concatAddress } from "~/components/Properties/Property";
import { useState } from "react";
// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

const AddRoomButton = () => {
    const [textboxOpen, setTextboxOpen] = useState(false);
    const OpenTextboxButtonClick = () => {
        //toggle textboxOpen
        setTextboxOpen(!textboxOpen);
    }
    if (textboxOpen) {
        return(
            <div>
                <input />
                <button>Add</button>
            </div>
        )
    }
    return(
        <button onClick={OpenTextboxButtonClick} >Add Room</button>
    )
}


type Level = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"][number]

type LevelProps = {
    level: Level
}

const Level: React.FC<LevelProps> = ({ level }) => {

    return(
        <div>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black" >{level.label}</h2>
            {level.rooms.map((room, index) => {
                return(
                    <p key={index} >{room.label}</p>
                )
            })}
            <AddRoomButton />
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
            {property.levels.map((level, index) => {
                return(
                    <Level level={level} />
                )
            })}
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

