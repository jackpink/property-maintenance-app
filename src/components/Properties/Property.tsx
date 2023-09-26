
import Link from "next/link";
import Image from "next/image";
import house from '../../images/demo-page/house-stock-image.png';
import { type RouterOutputs } from "~/utils/api";
import { useRouter } from "next/router";

type PropertyWithoutJobs = RouterOutputs["job"]["getRecentJobsForTradeUser"][number]["Property"]

export const concatAddress = (property: PropertyWithoutJobs) => {
    console.log("property", property)
    let address = property.streetNumber + ' ' + property.street + ', ' + property.suburb + ', ' + property.state + ', ' + property.country;
    if (!!property.apartment) {
        // add apartment number in front /
        
        address = property.apartment + ' / ' + address;
    }
    return address;
}

type Property = RouterOutputs["property"]["getPropertiesForTradeUser"][number]

type Props = {
    property: Property
}

 const Property: React.FC<Props>= ({ property}) => {
    const address = concatAddress(property)
    const { asPath } = useRouter();
    return(
        <Link href={`${asPath}/property/${property.id}`} >        
        <div className="grid grid-cols-3 border-solid border-2 border-teal-800 rounded-xl w-full hover:bg-black/20" >
            <Image 
            alt="House Stock Image"
            src={house} 
            className="min-w-xl p-3 rounded-xl"/>
            <div className="col-span-2 relative">
                <h1 className="text-slate-900 font-extrabold text-lg lg:text-2xl p-3">{address}</h1>
                <h2 className="p-3">Last Job: <span className="font-italic">{property.jobs[0]?.title}</span></h2>
            </div>
        </div>
        </Link>

    );
}

export default Property;