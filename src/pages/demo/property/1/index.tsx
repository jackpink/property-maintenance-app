import { type NextPage } from "next";
import { concatAddress } from "~/components/Properties/Property";
import { properties } from "../..";
import Rooms from "~/components/Rooms";

const PropertyPage: NextPage = () => {
    let address = '';
    let levels: ILevel[] = [];
    if (properties[0]) {
        address = concatAddress(properties[0]);
        levels = properties[0].levels;
    }

    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black">This is your Dashboard. Select a specific property or browse recent jobs here.</h2>
            <Rooms levels={levels}/>
        </div>
    )
}

export default PropertyPage;