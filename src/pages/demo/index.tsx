import { type NextPage } from "next";
import Properties from "~/components/Properties";

const properties: IProperty[] = [{apartment: '', streetnumber: '47', street: 'Donnelly Street', suburb: 'Balmain', postcode: '2041', state: 'NSW', country: 'Australia', lastjob: 'Patch and Paint'}, {apartment: '7602', streetnumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia', lastjob: 'Repair Leaking Tap'}]

const DemoPage: NextPage = () => {

    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1>Demo Page - Trade Dashboard</h1>
            <Properties properties={properties} /> 
            <h1>Recents Jobs</h1>
        </div>
    )
}

export default DemoPage