import { useRouter } from "next/router";
import { RouterOutputs, api } from "~/utils/api";
import { concatAddress } from "~/components/Properties/Property";

type Job = RouterOutputs["job"]["getJobForTradeUser"];

type TradeJobPageWithParams = {
    job: Job
}

const TradeJobPageWithParams: React.FC<TradeJobPageWithParams> = ({ job }) => {
    const address = concatAddress(job.Property);

    return(
        <>
        <p>{job.title}</p>
        <p>{job.date.toDateString()}</p>
        <p>{address}</p>
        </>
    )
}


const TradeJobPage = ()  => {

    const id = useRouter().query.index?.toString(); 
    
    //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
    if (!id) return <>loading</>

    const job = api.job.getJobForTradeUser.useQuery({jobId: id});

    if (!job.data) return <>Loading</>

    return(
        <TradeJobPageWithParams  job={job.data} />
    )
    

}

export default TradeJobPage;