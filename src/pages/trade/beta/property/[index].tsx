import {  api } from "~/utils/api";
import { useRouter } from "next/router";
import { concatAddress } from "~/components/Properties/Property";
import EditProperty from "~/components/EditProperty";
import RecentJobs from "~/components/RecentJobs";
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
    const recentJobs = api.job.getRecentJobsForPropertyByTradeUser.useQuery({ propertyId: propertyId});
    if (!property.data || !recentJobs.data) return <>Loading</>

    const address = concatAddress(property.data);

    return(
        <div> 
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            
            <EditProperty property={property.data} />
            <div className="pb-8 mb-8 border-black border-b-2"></div>
            <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
                <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Recents Jobs</h2>
                <RecentJobs recentJobs={recentJobs.data} />
            </div>
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

