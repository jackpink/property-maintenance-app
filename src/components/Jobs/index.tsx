import JobPopover from './JobPopover';
import { RoomSelectorOneLevel, RoomSelectorTwoLevel } from './RoomSelector';
import { SetStateAction, Dispatch } from 'react';

/* 
Need to create columns for the levels of the property, 
may need to define a max allowed levels, ie 6
Then just loop through the rooms for each level and 
add room buttons

will need useState to track current room

Then create a hidden version which is displayed on larger screen size
*/
export type selectedJob = {
    id: string
    title: string
    date: Date
}


type Props = {
    jobs: IJob[]
    selectedJob: selectedJob
    setSelectedJob: Dispatch<SetStateAction<selectedJob>>
}

const Jobs: React.FC<Props> = ({ jobs, selectedJob, setSelectedJob }) => {

    return (
        <JobPopover selectedJob={selectedJob} >
            <p>Jobs</p>
        </JobPopover>
    )}

    export default Jobs;