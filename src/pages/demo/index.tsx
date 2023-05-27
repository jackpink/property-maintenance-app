import { type NextPage } from "next";
import Properties from "~/components/Properties";

const properties: IProperty[] = [{apartment: '', streetnumber: '47', street: 'Donnelly Street', suburb: 'Balmain', postcode: '2041', state: 'NSW', country: 'Australia', lastjob: 'Patch and Paint'}, {apartment: '7602', streetnumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia', lastjob: 'Repair Leaking Tap'}]

const DemoPage: NextPage = () => {

    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">Welcome TradeCo Pty Ltd</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black">This is your Dashboard. Select a specific property or browse recent jobs here.</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Properties</h2>
            <Properties properties={properties} /> 
            <div className="pb-8 mb-8 border-black border-b-2"></div>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Recents Jobs</h2>
        </div>
    )
}

export default DemoPage