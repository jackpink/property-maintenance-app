import {  api } from "~/utils/api";
import { useRouter } from "next/router";
import Calendar from 'react-calendar';
import { concatAddress } from "~/components/Properties/Property";
import EditProperty from "~/components/EditProperty";
import RecentJobs from "~/components/RecentJobs";
import Button from "~/components/Button";
import Popover from "~/components/Popover";
import { useState } from "react";
import clsx from "clsx";
// build the property page
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CreateJobForm: React.FC = () => {
    
    const [jobTitleInput, setJobTitleInput] = useState('');
    const [error, setError] = useState(false);
    const [date, onChange] = useState<Value>(new Date());

    

    return(
        <div className="">
            <input onChange={e => setJobTitleInput(e.target.value)} disabled={false} className={clsx("w-full p-2 text-slate-900 font-extrabold outline-none", {"border border-2 border-red-500": error})}/>
            <Calendar onChange={onChange} value={date} />

            <Button>Create Job</Button>
        </div>
    )
}

type TradePropertyPageWithParamsProps = {
    propertyId: string
}

const TradePropertyPageWithParams: React.FC<TradePropertyPageWithParamsProps> = ({ propertyId }) => {
    const [createJobPopoverOpen, setCreatejobPopoverOpen] = useState(false);
    
    const property = api.property.getPropertyForTradeUser.useQuery({id: propertyId});
    const recentJobs = api.job.getRecentJobsForPropertyByTradeUser.useQuery({ propertyId: propertyId});
    if (!property.data || !recentJobs.data) return <>Loading</>

    const address = concatAddress(property.data);

    return(
        <div className="grid grid-cols-1"> 
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            
            <EditProperty property={property.data} />
            <div className="pb-8 mb-8 border-black border-b-2"></div>
            <div className="place-self-center w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
                <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Recents Jobs</h2>
                <Button onClick={() => setCreatejobPopoverOpen(true)} className="place-self-center mb-8">Add New Job</Button>
                <Popover isOpen={createJobPopoverOpen} setIsOpen={setCreatejobPopoverOpen}>
                    <CreateJobForm />
                </Popover>
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

