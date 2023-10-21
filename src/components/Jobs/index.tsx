import { type RouterOutputs } from "~/utils/api";
import JobPopover from "./JobPopover";
import {
  type SetStateAction,
  type Dispatch,
  type PropsWithChildren,
  type MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

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
  jobs: Jobs;
  selectedJobs: SelectedJobs;
  setSelectedJobs: Dispatch<SetStateAction<SelectedJobs>>;
};

const getByID = (id: string, jobs: Jobs) => {
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return null;
  }
  return job;
};

const Jobs: React.FC<Props> = ({ jobs, selectedJobs, setSelectedJobs }) => {
  const EventClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newSelectedJobID: string = event.currentTarget.value;
    console.log("button clicked", newSelectedJobID);
    const newSelectedJob = getByID(newSelectedJobID, jobs);
    if (!!newSelectedJob) {
      const elementSelected = checkIfSelected(newSelectedJob.id, selectedJobs);
      if (elementSelected) setSelectedJobs([]);
      //remove from selected jobs
      else setSelectedJobs((j) => [...j, newSelectedJob]);
    }
  };

  return (
    <JobPopover selectedJobs={selectedJobs}>
      <Timeline>
        {jobs.map((job, index) => {
          return (
            <Element
              job={job}
              key={index}
              selectedEvents={selectedJobs}
              onClick={EventClicked}
            />
          );
        })}
      </Timeline>
    </JobPopover>
  );
};

export default Jobs;

interface SelectedEvent {
  id: string;
}

type SelectedEvents = SelectedEvent[];

export interface ElementProps {
  job: Job;
  onClick: MouseEventHandler<HTMLButtonElement>;
  selectedEvents: SelectedEvents;
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
  for (const selectedEvent of selectedEvents) {
    if (selectedEvent.id === jobId) return true;
  }
  return false;
};

const Element: React.FC<ElementProps> = (props) => {
  const [checked, setChecked] = useState(false);

  const { job, selectedEvents, onClick } = props;
  useEffect(() => {
    const checkElement = checkIfSelected(job.id, selectedEvents);
    console.log("CHECKING EVENTS", checkElement, job.id, selectedEvents);
    setChecked(checkIfSelected(job.id, selectedEvents));
  }, [job.id, selectedEvents]);

  return (
    <li className="relative table-cell text-sm">
      <div className="flex flex-wrap">
        <span className="my-3 flex-1 whitespace-nowrap bg-black"></span>
        <button
          value={job.id}
          onClick={onClick}
          className={clsx(
            "h-8",
            "w-8",
            "flex-none",
            "border-2",
            "border-solid",
            "border-black",
            "rounded-2xl",
            "whitespace-nowrap",
            {
              "bg-emerald-600": checked,
              "after:content-['✓']": checked,
            }
          )}
          id="element-radio"
        ></button>
        <span className="my-3 flex-1 whitespace-nowrap bg-black"></span>
        <span className="w-0 flex-1 basis-full"></span>
        <button
          value={job.id}
          onClick={onClick}
          className="top-24 min-w-max basis-full px-4"
        >
          <p className="text-lg">{job.title}</p>
          <p className="italic">Your Company</p>
          <p className="text-xs">{job.date.toDateString()}</p>
        </button>
      </div>
    </li>
  );
};

const Timeline: React.FC<PropsWithChildren> = (props) => {
  //const {label = "timeline"} = props;

  return (
    <div className="overflow-x-auto">
      <ul className="table w-full py-12">{props.children}</ul>
    </div>
  );
};
