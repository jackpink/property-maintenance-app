import {  api } from "~/utils/api";
import { useRouter } from "next/router";
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { concatAddress } from "~/components/Properties/Property";
import EditProperty from "~/components/EditProperty";
import RecentJobs from "~/components/RecentJobs";
import Button from "~/components/Button";
import Popover from "~/components/Popover";
import { useState } from "react";
import clsx from "clsx";
import z from 'zod';
import 'react-day-picker/dist/style.css';
// build the property page
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

const ValidJobInput = z.string().min(5, { message: "Must be 5 or more characters long" }).max(30, {message: "Must be less than 30 characters"});

type CreateJobFormProps = {
    propertyId: string
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ propertyId }) => {
    
    const [jobTitleInput, setJobTitleInput] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [date, setDate] = useState<Date>(new Date());

    const router = useRouter();

    const { mutate: createJob, isLoading: isCreatingJob } = api.job.createJobForPropertyByTrade.useMutation({
        onSuccess: ({ job }) => {
            // Redirect to new Job route
            console.log("redirect to job/", job.id);
            router.push('/trade/beta/job/'+ job.id);
        }
    });

    const addJobClickEvent = (event: any) => {
        // Check The Room input for correctness
        const checkAddJobInput = ValidJobInput.safeParse(jobTitleInput);
        if (!checkAddJobInput.success) {
            console.log("throw error on input");
            const errorFormatted = checkAddJobInput.error.format()._errors.pop()
            if (!!errorFormatted) setErrorMessage(errorFormatted);
            setError(true);
        } else {
            console.log("add job", jobTitleInput);
            createJob({
                title: jobTitleInput,
                propertyId: propertyId,
                date: date

            })
        }        
    }

    return(
        <div className="grid justify-items-center">
            <label  className="block text-sm font-medium text-gray-700"> Enter Job Title </label>
            <input onChange={e => setJobTitleInput(e.target.value)} disabled={isCreatingJob} className={clsx("w-3/4 p-2 text-slate-900 font-extrabold rounded text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent ring-2 ring-white ring-offset-2 ring-offset-gray-300 md:w-96", {"border border-2 border-red-500": error})}/>
            <label  className="block text-sm font-medium text-gray-700"> Job Date</label>
            {date ? (
                <p className="p-2 text-slate-900 font-extrabold ">{format(date, 'PPP')}</p>
            ) : (null)}
            

            <DayPicker 
                mode="single"
                required
                selected={date}
                onSelect={setDate} 
                />

            <Button onClick={addJobClickEvent}>Create Job</Button>
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
                <Popover popoveropen={createJobPopoverOpen} setPopoverOpen={setCreatejobPopoverOpen}>
                    <CreateJobForm propertyId={property.data.id} />
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