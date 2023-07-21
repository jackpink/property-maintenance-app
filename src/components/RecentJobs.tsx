import { RouterOutputs } from '~/utils/api'
import { concatAddress } from './Properties/Property'
import Link from 'next/link'

type RecentJobs = RouterOutputs["job"]["getRecentJobsForTradeUser"]

type RecentJob = RouterOutputs["job"]["getRecentJobsForTradeUser"][number]

type JobProps = {
    job: RecentJob
}

type RecentJobsProps = {
    recentJobs: RecentJobs
}

const Job: React.FC<JobProps> = ({ job }) => {
    const address = concatAddress(job.Property);
    const date = job.date.toDateString();
    return(
        <Link href={`/trade/beta/job/${job.id}`} className="grid grid-cols-4 border-solid border-2 border-teal-800 rounded-xl w-full hover:bg-black/20" >
            <div className="col-span-3 relative">
                <h1 className="text-slate-900 text-lg font-extrabold lg:text-2xl p-3">{job.title}</h1>
                <h2 className="p-3 font-italic">{address}</h2>
            </div>
            <div className=" relative">
                <h2>{date}</h2>
            </div>
        </Link>
    )
}


const RecentJobs: React.FC<RecentJobsProps> = ({ recentJobs }) => {

    return(
        <div className="flex flex-col space-y-4">
            {recentJobs.map((job, index) =>
                <Job job={job} key={index}/>
            )}
        </div>
    )
}

export default RecentJobs;
