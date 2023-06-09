import Timeline from '../Timeline';
import Element from '../Timeline/Element';
import JobPopover from './JobPopover';
import { SetStateAction, Dispatch } from 'react';

/* 
Need to create columns for the levels of the property, 
may need to define a max allowed levels, ie 6
Then just loop through the rooms for each level and 
add room buttons

will need useState to track current room

Then create a hidden version which is displayed on larger screen size
*/


type Props = {
    jobs: IJob[]
    selectedJob: IJob
    setSelectedJob: Dispatch<SetStateAction<IJob>>
}

const getByID = (id: string, jobs: IJob[]) => {
    const job = jobs.find((job) => job.id === id);
    if (!job) {
        return {id: '', title:" ", date: new Date(), documents: [], photos: [], notes: [], property: {apartment: '', streetnumber: '', street: '', suburb: '', postcode: '', state: '', country: '', lastjob: '', levels: []}}
    }
    return job;

}

const Jobs: React.FC<Props> = ({ jobs, selectedJob, setSelectedJob }) => {



    const EventClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newSelectedJobID: string = event.currentTarget.value;
        console.log("button clicked", newSelectedJobID);
        const newSelectedJob = getByID(newSelectedJobID, jobs)
        setSelectedJob(newSelectedJob);
    }

    return (
        <JobPopover selectedJob={selectedJob} >
            <Timeline >
                {jobs.map((job, index) => {
                    return(
                        <Element job={job} key={index} selectedEvent={selectedJob} onClick={EventClicked}/>
                    )
                })}
            </Timeline>
        </JobPopover>
    )}

    export default Jobs;