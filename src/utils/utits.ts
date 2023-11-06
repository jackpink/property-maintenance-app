import { format } from "date-fns";

export function FormattedDate(date?: Date) {
    let formattedDate = "";
    date && (formattedDate = format(date, "PPP"));
    return formattedDate;
  }

interface PropertyWithoutJobs {
  streetNumber: string;
  street: string;
  suburb: string;
  state: string;
  country: string;
  apartment: string | null;
}
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