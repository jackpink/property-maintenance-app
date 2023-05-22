import { NextPage } from "next";

const properties = {apartment: null, streetnumber: '47', street: 'Donnelly Street', suburb: 'Balmain', state: 'NSW', country: 'Australia', lastjob: 'Repair Leaking Tap'} 

const DemoPage: NextPage = () => {

    return(
        <>
            <h1>Demo Page - Trade Dashboard</h1>
            <h1>Properties</h1>
            <h1>Recents Jobs</h1>
        </>
    )
}

export default DemoPage