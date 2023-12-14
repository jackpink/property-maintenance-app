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
  onClickJobAdd: (jobId: string) => void;
  onClickJobRemove: (jobId: string) => void;
};

const getByID = (id: string, jobs: Jobs) => {
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return null;
  }
  return job;
};

const Jobs: React.FC<Props> = ({
  jobs,
  selectedJobs,
  onClickJobAdd,
  onClickJobRemove,
}) => {
  return (
    <Timeline>
      {jobs.map((job, index) => {
        return (
          <Element
            job={job}
            key={index}
            selectedEvents={selectedJobs}
            onClickJobAdd={onClickJobAdd}
            onClickJobRemove={onClickJobRemove}
          />
        );
      })}
    </Timeline>
  );
};

export default Jobs;

interface SelectedEvent {
  id: string;
}

type SelectedEvents = SelectedEvent[];

export interface ElementProps {
  job: Job;
  onClickJobAdd: (jobId: string) => void;
  onClickJobRemove: (jobId: string) => void;
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
  const { job, selectedEvents, onClickJobAdd, onClickJobRemove } = props;
  const selected = checkIfSelected(job.id, selectedEvents);

  return (
    <li className="relative table-cell text-sm">
      <div className="flex flex-wrap">
        <span className="my-3 flex-1 whitespace-nowrap bg-black"></span>
        {selected ? (
          <button
            value={job.id}
            onClick={(e) => onClickJobRemove(e.currentTarget.value)}
            className="h-8 w-8 flex-none whitespace-nowrap rounded-2xl border-2 border-solid border-black bg-emerald-600 after:content-['✓']"
            id="element-radio"
          ></button>
        ) : (
          <button
            value={job.id}
            onClick={(e) => onClickJobAdd(e.currentTarget.value)}
            className="h-8 w-8 flex-none whitespace-nowrap rounded-2xl border-2 border-solid border-black"
            id="element-radio"
          ></button>
        )}

        <span className="my-3 flex-1 whitespace-nowrap bg-black"></span>
        <span className="w-0 flex-1 basis-full"></span>
        {selected ? (
          <button
            value={job.id}
            onClick={(e) => onClickJobRemove(e.currentTarget.value)}
            className="top-24 min-w-max basis-full px-4"
          >
            <p className="text-lg">{job.title}</p>
            <p className="italic">Your Company</p>
            <p className="text-xs">{job.date.toDateString()}</p>
          </button>
        ) : (
          <button
            value={job.id}
            onClick={(e) => onClickJobAdd(e.currentTarget.value)}
            className="top-24 min-w-max basis-full px-4"
          >
            <p className="text-lg">{job.title}</p>
            <p className="italic">Your Company</p>
            <p className="text-xs">{job.date.toDateString()}</p>
          </button>
        )}
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
