
import Link from "next/link";
import Image from "next/image";
import house from '../../images/demo-page/house-stock-image.png';

export const concatAddress = (property: IProperty) => {
    let address = property.streetnumber + ' ' + property.street + ', ' + property.suburb + ', ' + property.state + ', ' + property.country;
    if (!(property.apartment === '')) {
        // add apartment number in front /
        address = property.apartment + ' / ' + address;
    }
    return address;
}

type Props = {
    property: IProperty
}

const Property: React.FC<Props>= ({ property}) => {
    const address = concatAddress(property)

    return(
        <Link href='/demo/property/1'>        
        <div className="grid grid-cols-3 border-solid border-2 border-teal-800 rounded-xl w-full hover:bg-black/20" >
            <Image 
            alt="House Stock Image"
            src={house} 
            className="min-w-xl p-3 rounded-xl"/>
            <div className="col-span-2 relative">
                <h1 className="text-slate-900 font-extrabold text-lg lg:text-2xl p-3">{address}</h1>
                <h2 className="p-3">Last Job: <span className="font-italic">{property.lastjob}</span></h2>
            </div>
        </div>
        </Link>

    );
}

export default Property;