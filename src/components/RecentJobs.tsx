import { type RouterOutputs } from "~/utils/api";
import { concatAddress } from "./Properties/Property";
import Link from "next/link";
import { useRouter } from "next/router";

type RecentJobs = RouterOutputs["job"]["getRecentJobsForTradeUser"];

type RecentJob = RouterOutputs["job"]["getRecentJobsForTradeUser"][number];

type JobProps = {
  job: RecentJob;
};

type RecentJobsProps = {
  recentJobs: RecentJobs;
};

const Job: React.FC<JobProps> = ({ job }) => {
  let { asPath } = useRouter();
  console.log(asPath);
  const pathArray = asPath.split("/");
  console.log(pathArray);
  if (pathArray[1] === "homeowner") asPath = "/homeowner";
  const address = concatAddress(job.Property);
  const date = job.date.toDateString();
  return (
    <Link
      href={`/job/${job.id}`}
      className="grid w-full grid-cols-4 rounded-xl border-2 border-solid border-teal-800 hover:bg-black/20"
    >
      <div className="relative col-span-3">
        <h1 className="p-3 text-lg font-extrabold text-slate-900 lg:text-2xl">
          {job.title}
        </h1>
        <h2 className="font-italic p-3">{address}</h2>
      </div>
      <div className=" relative">
        <h2>{date}</h2>
      </div>
    </Link>
  );
};

const RecentJobs: React.FC<RecentJobsProps> = ({ recentJobs }) => {
  return (
    <div className="flex flex-col space-y-4">
      {recentJobs.length > 0 ? (
        <>
          {recentJobs.map((job, index) => (
            <Job job={job} key={index} />
          ))}
        </>
      ) : (
        <p className="px-12 pb-4 text-center text-lg text-slate-700">
          No jobs are currently linked to this property, add a new one above.
        </p>
      )}
    </div>
  );
};

export default RecentJobs;
