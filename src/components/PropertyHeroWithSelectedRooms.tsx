import Link from "next/link";
import { concatAddress } from "./Properties/Property";
import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import house from "../images/demo-page/house-stock-image.png";

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type Property = RouterOutputs["job"]["getJobForHomeowner"]["Property"];

type Rooms = Job["rooms"];

type PropertyHeroWithSelectedRoomsProps = {
  Property: Property;
  rooms: Rooms;
};

const PropertyHeroWithSelectedRooms: React.FC<
  PropertyHeroWithSelectedRoomsProps
> = ({ Property, rooms }) => {
  const address = concatAddress(Property);

  return (
    <Link
      href={`/homeowner/property/${Property.id}`}
      className="w-3/4 place-self-center md:w-1/2"
    >
      <div className="grid grid-cols-3 rounded-xl border-2 border-solid border-teal-800 hover:bg-black/20">
        <Image
          alt="House Stock Image"
          src={house}
          className="min-w-xl rounded-xl p-3"
        />
        <div className="relative col-span-2">
          <h1 className="p-3 text-lg font-extrabold text-slate-900 lg:text-2xl">
            {address}
          </h1>
          {rooms.map((room, index) => {
            return (
              <p className="text-xs font-light text-slate-600" key={index}>
                {room.Level.label.toUpperCase() +
                  "→" +
                  room.label.toUpperCase()}
              </p>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

export default PropertyHeroWithSelectedRooms;
