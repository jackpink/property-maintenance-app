import { useRouter } from "next/router";
import { RouterOutputs, api } from "~/utils/api";
import { concatAddress } from "~/components/Properties/Property";
import Link from "next/link";
import Image from "next/image";
import house from '../../../../images/demo-page/house-stock-image.png';
import Button from "~/components/Button";
import Popover from "~/components/Popover";
import { useState } from "react";

type Room = RouterOutputs["job"]["getJobForTradeUser"]["rooms"][number];

type RoomSelectorProps = {
    rooms: Room[]
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms }) => {

    const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

    return(
        <div>
            <Button onClick={() => setRoomSelectorOpen(true)} className="w-48 place-self-center">Select Rooms</Button>
            <Popover popoverOpen={roomSelectorOpen} setPopoverOpen={setRoomSelectorOpen}>
                <>rooms</>
            </Popover>
        </div>
    )
}

type Property = RouterOutputs["job"]["getJobForTradeUser"]["Property"]

type PropertyProps = {
    property: Property
}

 const Property: React.FC<PropertyProps>= ({ property}) => {
    const address = concatAddress(property)
    return(
        <Link href={`/trade/beta/property/${property.id}`} className="w-3/4 md:w-1/2 place-self-center">        
        <div className="grid grid-cols-3 border-solid border-2 border-teal-800 rounded-xl hover:bg-black/20" >
            <Image 
            alt="House Stock Image"
            src={house} 
            className="min-w-xl p-3 rounded-xl"/>
            <div className="col-span-2 relative">
                <h1 className="text-slate-900 font-extrabold text-lg lg:text-2xl p-3">{address}</h1>
            </div>
        </div>
        </Link>

    );
 }

type Job = RouterOutputs["job"]["getJobForTradeUser"];

type TradeJobPageWithParams = {
    job: Job
}

const TradeJobPageWithParams: React.FC<TradeJobPageWithParams> = ({ job }) => {
    const address = concatAddress(job.Property);

    return(
        <div className="grid justify-center">
            <p className="place-self-center">{job.date.toDateString()}</p>
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{job.title}</h1>
            <Property property={job.Property} />
            <RoomSelector rooms={job.rooms} />
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Notes</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Documents</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Photos</h2>
        </div>
    )
}


const TradeJobPage = ()  => {

    const id = useRouter().query.index?.toString(); 
    
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    if (!id) return <>loading</>

    const job = api.job.getJobForTradeUser.useQuery({jobId: id});

    if (!job.data) return <>Loading</>

    return(
        <TradeJobPageWithParams  job={job.data} />
    )
    

}

export default TradeJobPage;