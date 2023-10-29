import { format } from "date-fns";

export function FormattedDate(date?: Date) {
    let formattedDate = "";
    date && (formattedDate = format(date, "PPP"));
    return formattedDate;
  }