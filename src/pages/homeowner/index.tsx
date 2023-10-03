import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Button from "~/components/Button";
import Properties from "~/components/Properties";
import RecentJobs from "~/components/RecentJobs";
import { api } from "~/utils/api";

const HomeownerPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  console.log(userId);
  if (!userId || !user) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return <HomeownerPageWithUser userId={userId} name={user.fullName} />;
};

type HomeownerPageWithUserProps = {
  userId: string;
  name: string | null;
};

const HomeownerPageWithUser: React.FC<HomeownerPageWithUserProps> = ({
  userId,
  name,
}) => {
  const properties = api.property.getPropertiesForHomeownerUser.useQuery({
    user: userId,
  });
  const jobs = api.job.getRecentJobsForHomeownerUser.useQuery({ user: userId });
  if (!!jobs.data && !!properties.data) {
    return (
      <div className="flex grid w-9/12 grid-cols-1  flex-col md:w-8/12 lg:w-7/12 xl:w-128">
        <h1 className="py-8 text-center font-sans text-4xl font-extrabold text-slate-900">
          Welcome {name}
        </h1>
        <h2 className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
          This is your Dashboard. Select a specific property or browse recent
          jobs here.
        </h2>
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Properties
        </h2>
        {properties.data.length > 0 ? (
          <Properties properties={properties.data} />
        ) : (
          <p className="text-center">You don't have any properties yet</p>
        )}
        <Link href="/create-property">
          <Button>Create Property</Button>
        </Link>
        <div className="mb-8 border-b-2 border-black pb-8"></div>
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Recents Jobs
        </h2>
        <RecentJobs recentJobs={jobs.data} />
      </div>
    );
  } else return <>loading</>;
};

export default HomeownerPage;
