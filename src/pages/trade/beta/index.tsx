import { api } from "~/utils/api";
import { useAuth } from "@clerk/nextjs";

import Properties from "~/components/Properties";
import RecentJobs from "~/components/RecentJobs";

type Props = {
    userId: string
}

const TradeDashboardPageWithUser: React.FC<Props> = ({ userId })  => {
   
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    const jobs = api.job.getRecentJobsForTradeUser.useQuery({ user: userId});
    if (!!jobs.data){
    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">Welcome TradeCo Pty Ltd</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black">This is your Dashboard. Select a specific property or browse recent jobs here.</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Properties</h2>
            <div className="pb-8 mb-8 border-black border-b-2"></div>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Recents Jobs</h2>
            <RecentJobs recentJobs={jobs.data} />
        </div>
    )}
    else return <>loading</>
    

}

const TradeDashboardPage = ()  => {
    const { userId } = useAuth();
    console.log(userId);
    if (!userId) {
        return <>Loading</>
    }
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    
    return(
        <TradeDashboardPageWithUser userId={userId} />
    )
    

}

export default TradeDashboardPage;