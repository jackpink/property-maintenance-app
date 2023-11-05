import { RouterOutputs } from "~/utils/api";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";
import RecentJobsViewer from "../Molecules/RecentJobsViewer";

type RecentJobs = RouterOutputs["job"]["getRecentJobsForProperty"];

type PropertyRecentJobsProps = {
  recentJobs: RecentJobs;
  loading: boolean;
  fetchErrormessage?: string | null;
};

const PropertyRecentJobs: React.FC<PropertyRecentJobsProps> = ({
  recentJobs,
  loading,
  fetchErrormessage,
}) => {
  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Recent Jobs</PageSubTitle>
      </BackgroundContainerHeader>
      <div className="relative flex flex-wrap justify-center">
        {loading ? (
          <p className=" px-12 pb-4 text-center text-lg text-slate-700">
            Loading Recent jobs
          </p>
        ) : !recentJobs ? (
          <p className=" px-12 pb-4 text-center text-lg text-slate-700">
            {fetchErrormessage}
          </p>
        ) : (
          <>
            <RecentJobsViewer recentJobs={recentJobs} />
          </>
        )}
      </div>
    </BackgroundContainer>
  );
};

export default PropertyRecentJobs;
