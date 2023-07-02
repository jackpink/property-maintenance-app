import {  api } from "~/utils/api";
import { useRouter } from "next/router";
import { concatAddress } from "~/components/Properties/Property";
import EditProperty from "~/components/EditProperty";
// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms



type TradePropertyPageWithParamsProps = {
    propertyId: string
}

const TradePropertyPageWithParams: React.FC<TradePropertyPageWithParamsProps> = ({ propertyId }) => {
    
    const property = api.property.getPropertyForTradeUser.useQuery({id: propertyId});
    if (!property.data) return <>Loading</>

    const address = concatAddress(property.data);

    return(
        <div> 
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            
            <EditProperty property={property.data} />
        </div>
    )
}

const TradePropertyPage = ()  => {

    const id = useRouter().query.index?.toString(); 
    
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    if (!id) return <>loading</>
    return(
        <TradePropertyPageWithParams  propertyId={id} />
    )
    

}

export default TradePropertyPage;

