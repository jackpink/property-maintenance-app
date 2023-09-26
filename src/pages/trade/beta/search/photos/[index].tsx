import { type NextPage } from "next";
import { concatAddress } from "~/components/Properties/Property";
import Rooms, {SelectedRoom } from "~/components/Rooms";
import Jobs, { SelectedJobs } from "~/components/Jobs";
import Documents from "~/components/Documents";

import { Dispatch, SetStateAction, useState } from "react";
import Photos from "~/components/Photos";
import { useRouter } from "next/router";
import { RouterOutputs, api } from "~/utils/api";

//const initialRoom:selectedRoom = {level: '', room: ''};
//const initialJob: IJob = {id: '', title:" ", date: new Date(), documents: [], photos: [], notes: [], property: {apartment: '', streetnumber: '', street: '', suburb: '', postcode: '', state: '', country: '', lastjob: '', levels: []}}

type JobsForSelectedRoomProps = {
    selectedRoom: SelectedRoom,
    selectedJobs: SelectedJobs,
    setSelectedJobs: Dispatch<SetStateAction<SelectedJobs>>
}

const JobsForSelectedRoom:React.FC<JobsForSelectedRoomProps> = ({ selectedRoom, selectedJobs, setSelectedJobs }) => {
    // get Jobs for the selected room
    if (!selectedRoom.room) return <>no room selected</>
    const jobs = api.job.getJobsForRoom.useQuery({roomId: selectedRoom.room.id})
    if (!jobs.data) return <>loading jobs</>
    return(
        <Jobs jobs={jobs.data} selectedJobs={selectedJobs} setSelectedJobs={setSelectedJobs}/>
    )
}


type Room = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"][number]["rooms"][number];

type PropertyPhotoSearchPageWithParamsProps = {
    propertyId: string
}

const PropertyPhotoSearchPageWithParams: React.FC<PropertyPhotoSearchPageWithParamsProps> = ({ propertyId }) => {
    const  [selectedRoom, setSelectedRoom ] = useState<SelectedRoom>({room: null, level: null});
    const [selectedJobs, setSelectedJobs] = useState<SelectedJobs>([]);
    console.log("Slected jobs", selectedJobs)
    
    const property = api.property.getPropertyForTradeUser.useQuery({id: propertyId});
    if (!property.data) return <>Loading</>

    const address = concatAddress(property.data);

    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black">This is your Dashboard. Select a specific property or browse recent jobs here.</h2>
            <div className="flex flex-wrap gap-8 justify-between" >
                <Rooms levels={property.data.levels} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
                <JobsForSelectedRoom selectedRoom={selectedRoom} selectedJobs={selectedJobs} setSelectedJobs={setSelectedJobs}/>
            </div>
            <div className="pt-8 text-slate-600 border-b-4 border-slate-600">Documents</div>
            <Documents documents={[{name: "Invoice for "},{name: "Product in room " + selectedRoom.room}]} />
            <div className="pt-8 text-slate-600 border-b-4 border-slate-600">Photos </div>
           
        </div>
    )
}

const PropertyPhotoSearchPage = ()  => {

    const id = useRouter().query.index?.toString(); 
    
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    if (!id) return <>loading</>

    return(
        <PropertyPhotoSearchPageWithParams  propertyId={id} />
    )
    

}

export default PropertyPhotoSearchPage;