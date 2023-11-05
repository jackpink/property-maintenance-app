import { api } from "~/utils/api";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { Text } from "../Atoms/Text";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";
import RecentJobsViewer from "../Molecules/RecentJobsViewer";

type DashboardRecentJobsProps = {
  userId: string;
};

const DashboardRecentJobs: React.FC<DashboardRecentJobsProps> = ({
  userId,
}) => {
  const { data: jobs, isLoading } =
    api.job.getRecentJobsForHomeownerUser.useQuery({ user: userId });

  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Recent Jobs</PageSubTitle>
      </BackgroundContainerHeader>
      {isLoading && (
        <div className="h-20 w-20">
          <LoadingSpinner />
        </div>
      )}
      {!jobs ? (
        <Text className="text-center">Failed to load recent jobs</Text>
      ) : jobs.length > 0 ? (
        <div className="p-8">
          <RecentJobsViewer recentJobs={jobs} />
        </div>
      ) : (
        <Text className="text-center">
          You don&apos;t have any recent jobs to view. Add one to a your
          property.
        </Text>
      )}
    </BackgroundContainer>
  );
};
export default DashboardRecentJobs;
