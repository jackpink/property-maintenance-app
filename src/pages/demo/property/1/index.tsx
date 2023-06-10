import { type NextPage } from "next";
import { concatAddress } from "~/components/Properties/Property";
import { properties, recentJobs } from "../..";
import Rooms, {selectedRoom } from "~/components/Rooms";
import Jobs from "~/components/Jobs";
import Documents from "~/components/Documents";
import { useState } from "react";
import Photos from "~/components/Photos";

const initialRoom:selectedRoom = {level: '', room: ''};
const initialJob: IJob = {id: '', title:" ", date: new Date(), documents: [], photos: [], notes: [], property: {apartment: '', streetnumber: '', street: '', suburb: '', postcode: '', state: '', country: '', lastjob: '', levels: []}}

const PropertyPage: NextPage = () => {
    const  [selectedRoom, setSelectedRoom ] = useState(initialRoom)
    const [selectedJob, setSelectedJob] = useState(initialJob);
    let address = '';
    let levels: ILevel[] = [];
    if (properties[0]) {
        address = concatAddress(properties[0]);
        levels = properties[0].levels;
        if (levels[0]?.rooms[0]) {
            //setSelectedRoom(levels[0].rooms[0].label);
        }
    }

    return(
        <div className="grid grid-cols-1 flex flex-col  w-9/12 md:w-8/12 lg:w-7/12 xl:w-128">
            <h1 className="font-sans text-slate-900 font-extrabold text-4xl text-center py-8">{address}</h1>
            <h2 className="font-sans text-slate-900 font-extrabold text-xl text-center py-4 mb-6 border-b-2 border-black">This is your Dashboard. Select a specific property or browse recent jobs here.</h2>
            <div className="flex flex-wrap gap-8 justify-between" >
                <Rooms levels={levels} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
                <Jobs jobs={recentJobs} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
            </div>
            <div className="pt-8 text-slate-600 border-b-4 border-slate-600">Documents</div>
            <Documents documents={[{name: "Invoice for "+ selectedJob.title},{name: "Product in room " + selectedRoom.room}]} />
            <div className="pt-8 text-slate-600 border-b-4 border-slate-600">Photos </div>
            <Photos photos={[{filename: "image1", url: "/photo-icon.png"}, {filename: "image2", url: "/photo-icon.png"},{filename: "image3", url: "/photo-icon.png"},{filename: "image4", url: "/photo-icon.png"},{filename: "image5", url: "/photo-icon.png"},{filename: "image6", url: "/photo-icon.png"},{filename: "image7", url: "/photo-icon.png"},{filename: "image8", url: "/photo-icon.png"},{filename: "image9", url: "/photo-icon.png"},{filename: "image10", url: "/photo-icon.png"}]} />
           
        </div>
    )
}

export default PropertyPage;