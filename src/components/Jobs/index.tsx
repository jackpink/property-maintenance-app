import { type RouterOutputs } from '~/utils/api';
import JobPopover from './JobPopover';
import { type SetStateAction, type Dispatch, type PropsWithChildren, type MouseEventHandler, useEffect, useRef } from 'react';
import clsx from 'clsx';

/* 
Need to create columns for the levels of the property, 
may need to define a max allowed levels, ie 6
Then just loop through the rooms for each level and 
add room buttons

will need useState to track current room

Then create a hidden version which is displayed on larger screen size
*/
type Jobs = RouterOutputs["job"]["getJobsForRoom"];

type Job = Jobs[number];

export type SelectedJobs = Job[];

type Props = {
    jobs: Jobs
    selectedJobs: SelectedJobs
    setSelectedJobs: Dispatch<SetStateAction<SelectedJobs>>
}

const getByID = (id: string, jobs: Jobs) => {
    const job = jobs.find((job) => job.id === id);
    if (!job) {
        return null;
    }
    return job;

}

const Jobs: React.FC<Props> = ({ jobs, selectedJobs, setSelectedJobs }) => {



    const EventClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newSelectedJobID: string = event.currentTarget.value;
        console.log("button clicked", newSelectedJobID);
        const newSelectedJob = getByID(newSelectedJobID, jobs)
        if (!!newSelectedJob) setSelectedJobs((j)=>[...j,newSelectedJob]);
    }

    return (
        <JobPopover selectedJobs={selectedJobs} >
            <Timeline >
                {jobs.map((job, index) => {
                    return(
                        <Element job={job} key={index} selectedEvents={selectedJobs} onClick={EventClicked}/>
                    )
                })}
            </Timeline>
        </JobPopover>
    )}

export default Jobs;

interface SelectedEvent {
    id: string
}

type SelectedEvents = SelectedEvent[];

export interface ElementProps {
    job: Job,
    onClick: MouseEventHandler<HTMLButtonElement> 
    selectedEvents: SelectedEvents
  }
/* a potentially handy typescript function, but also could indicate badly writen code
function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
if (argument === undefined || argument === null) {
    throw new TypeError(message);
}

return argument;
}
*/

const checkIfSelected = (jobId: string, selectedEvents: SelectedEvents) => {
    selectedEvents.forEach((selectedEvent)=> {
        if (selectedEvent.id === jobId) return true;
    })
    return false;
}

const Element: React.FC<ElementProps> = (props) => {
    const checked = useRef<boolean>(false)

    const { job, selectedEvents, onClick  } = props;
    useEffect( () => {
        console.log("CHECKING EVENTS");
        checked.current = checkIfSelected(job.id, selectedEvents);
    }, [selectedEvents])

    

    return(
        <li className="table-cell relative text-sm">
            <div  className="flex flex-wrap" >
                <span className="flex-1 whitespace-nowrap bg-black my-3"></span>
                <button value={job.id} onClick={onClick} className={clsx("h-8", "w-8", "flex-none", "border-2", "border-solid", "border-black", "rounded-2xl", "whitespace-nowrap", {"bg-emerald-600":checked.current, "after:content-['✓']":checked.current})} id="element-radio"></button>
                <span className="flex-1 whitespace-nowrap bg-black my-3"></span>
                <span className="flex-1 basis-full w-0"></span>
                <button value={job.id} onClick={onClick} className="px-4 basis-full top-24 min-w-max">
                    <p className="text-lg">{job.title}</p>
                    <p className="italic">Your Company</p>
                    <p className="text-xs">{job.date.toDateString()}</p>
                </button>
            </div>
        </li>
    )
}




const Timeline: React.FC<PropsWithChildren> = (props) => {
    //const {label = "timeline"} = props;

  return(
    <div className="overflow-x-auto">
      <ul className="table w-full py-12">
        {props.children}
      </ul>
    </div>
  );
};
  
