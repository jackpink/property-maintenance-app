import Link from "next/link";
import { concatAddress } from "~/utils/utits";
import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import house from "~/images/demo-page/house-stock-image.png";
import { Property } from "@prisma/client";
import { Text } from "../Atoms/Text";
import { CTAButton } from "../Atoms/Button";
import { Job } from "~/pages/homeowner/job/[index]";

type Rooms = Job["rooms"];

type PropertyHeroWithSelectedRoomsProps = {
  property: Property;
  rooms: Rooms;
};

const PropertyHeroWithSelectedRooms: React.FC<
  PropertyHeroWithSelectedRoomsProps
> = ({ property, rooms }) => {
  const address = concatAddress(property);

  return (
    <div>
      <div className="grid grid-cols-3  ">
        <Image
          alt="House Stock Image"
          src={house}
          className="min-w-xl overflow-hidden rounded-xl p-3"
        />
        <div className="relative col-span-2 flex flex-col justify-center">
          <Text className="p-3 text-lg font-extrabold ">{address}</Text>
          <CTAButton className="">Go To Property Page</CTAButton>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeroWithSelectedRooms;
