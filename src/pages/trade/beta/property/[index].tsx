import { RouterOutputs, api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { concatAddress } from "~/components/Properties/Property";
// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

type Property = RouterOutputs["property"]["getPropertyForTradeUser"]

type EditPropertyProps = {
    property: Property
}

const EditProperty: React.FC<EditPropertyProps> = ({ property }) => {
    const address = concatAddress(property);
    return(
        <>
            <h1>{address}</h1>
            {property.levels.map((level, index) => {
                return(
                    <p key={index}>{level.label}</p>
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
    const id = useRouter().query.index; 
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

