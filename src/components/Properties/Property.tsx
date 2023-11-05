import Link from "next/link";
import Image from "next/image";
import house from "../../images/demo-page/house-stock-image.png";
import { type RouterOutputs } from "~/utils/api";
import { useRouter } from "next/router";

type PropertyWithoutJobs = {
  streetNumber: string;
  street: string;
  suburb: string;
  state: string;
  country: string;
  apartment: string | null;
};
//RouterOutputs["job"]["getRecentJobsForTradeUser"][number]["Property"];

export const concatAddress = (property: PropertyWithoutJobs) => {
  let address =
    property.streetNumber +
    " " +
    property.street +
    ", " +
    property.suburb +
    ", " +
    property.state +
    ", " +
    property.country;
  if (!!property.apartment) {
    // add apartment number in front /

    address = property.apartment + " / " + address;
  }
  return address;
};

type Property = RouterOutputs["property"]["getPropertiesForTradeUser"][number];

type Props = {
  property: Property;
};

const Property: React.FC<Props> = ({ property }) => {
  const address = concatAddress(property);
  const { asPath } = useRouter();
  return (
    <Link href={`/property/${property.id}`}>
      <div className="grid w-full grid-cols-3 rounded-xl border-2 border-solid border-teal-800 hover:bg-black/20">
        <Image
          alt="House Stock Image"
          src={house}
          className="min-w-xl rounded-xl p-3"
        />
        <div className="relative col-span-2">
          <h1 className="p-3 text-lg font-extrabold text-slate-900 lg:text-2xl">
            {address}
          </h1>
          <h2 className="p-3">
            Last Job:{" "}
            <span className="font-italic">{property.jobs[0]?.title}</span>
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default Property;
