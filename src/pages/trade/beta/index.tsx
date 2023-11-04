import { api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";

import Properties from "~/components/Properties";
import RecentJobs from "~/components/RecentJobs";

type Props = {
  userId: string;
};

const TradeDashboardPageWithUser: React.FC<Props> = ({ userId }) => {
  const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({
    user: userId,
  });
  const jobs = api.job.getRecentJobsForTradeUser.useQuery({ user: userId });
  if (!!jobs.data && !!propertiesWithJobs.data) {
    return (
      <div className="flex grid w-9/12 grid-cols-1  flex-col md:w-8/12 lg:w-7/12 xl:w-128">
        <h1 className="py-8 text-center font-sans text-4xl font-extrabold text-slate-900">
          Welcome TradeCo Pty Ltd
        </h1>
        <h2 className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
          This is your Dashboard. Select a specific property or browse recent
          jobs here.
        </h2>
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Properties
        </h2>
        <Properties properties={propertiesWithJobs.data} />
        <div className="mb-8 border-b-2 border-black pb-8"></div>
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Recents Jobs
        </h2>
        <RecentJobs recentJobs={jobs.data} />
      </div>
    );
  } else return <>loading</>;
};

const TradeDashboardPage = () => {
  const { userId } = useAuth();
  console.log(userId);
  if (!userId) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return <TradeDashboardPageWithUser userId={userId} />;
};

export default TradeDashboardPage;
