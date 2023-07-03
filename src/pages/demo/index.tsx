import { type NextPage } from "next";
import Properties from "~/components/Properties";
import RecentJobs from "~/components/RecentJobs";

//export const properties: Properties = [{apartment: '', streetNumber: '47', street: 'Donnelly Street', suburb: 'Balmain', postcode: '2041', state: 'NSW', country: 'Australia', jobs: [{id: '1', createdAt: new Date(), title: "Patch and Paint", propertyId: "1", date: new Date(2023,5,27,12,0,0,0), tradeUserId: "userfewf"}], levels: [{label: 'Basement', order: 1, rooms: [{label: 'Games Room', order: 2}, {label: 'WC', order: 1}]}, {label: 'Ground', order: 1, rooms: [{label: 'Kitchen', order: 2}, {label: 'Dining', order: 1}]}]}, {apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia', lastjob: 'Repair Leaking Tap', levels: [{label: 'Basement', order: 1, rooms: [{label: 'Games Room', order: 2}, {label: 'WC', order: 1}]}]}]

export const properties2: Properties = [{id: '1', createdAt: new Date(),apartment: '', streetNumber: '47', street: 'Donnelly Street', suburb: 'Balmain', postcode: '2041', state: 'NSW', country: 'Australia', jobs: [{id: '1', createdAt: new Date(), title: "Patch and Paint", propertyId: "1", date: new Date(2023,5,27,12,0,0,0), tradeUserId: "userfewf"}]}, {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia', jobs: [{id: '1', createdAt: new Date(), title: 'Repair Leaking Tap', propertyId: "1", date: new Date(2023,5,27,12,0,0,0), tradeUserId: "userfewf"}] }]


export const recentJobs: RecentJobs = [{id: '1', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)}, 
                                        {id: '2', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Patch Wall", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)},
                                        {id: '3', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)},
                                        {id: '4', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)},
                                        {id: '5', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)},
                                        {id: '6', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)},
                                        {id: '7', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)},
                                        {id: '8', createdAt: new Date(),propertyId: '1', tradeUserId: '2', title: "Repair Leaking Tap", Property: {id: '1', createdAt: new Date(), apartment: '7602', streetNumber: '177-219', street: 'Mitchell Road', suburb: 'Erskinville', postcode: '2043', state: 'NSW', country: 'Australia'}, date: new Date(2023,5,27,12,0,0,0)}]

const DemoPage: NextPage = () => {

    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">Welcome TradeCo Pty Ltd</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black">This is your Dashboard. Select a specific property or browse recent jobs here.</h2>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Properties</h2>
            <Properties properties={properties2} /> 
            <div className="pb-8 mb-8 border-black border-b-2"></div>
            <h2 className="font-sans text-slate-900 font-extrabold text-3xl text-center pb-4">Recents Jobs</h2>
            <RecentJobs recentJobs={recentJobs} />
        </div>
    )
}

export default DemoPage