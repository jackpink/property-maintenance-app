import { NextPage } from "next";
import Properties from "~/components/Properties";

const properties: IProperty[] = [{apartment: '', streetnumber: '47', street: 'Donnelly Street', suburb: 'Balmain', postcode: '2041', state: 'NSW', country: 'Australia', lastjob: 'Patch and Paint'}, {apartment: '7602', streetnumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia', lastjob: 'Repair Leaking Tap'}]

const DemoPage: NextPage = () => {

    return(
        <>
            <h1>Demo Page - Trade Dashboard</h1>
            <Properties properties={properties} /> 
            <h1>Recents Jobs</h1>
        </>
    )
}

export default DemoPage