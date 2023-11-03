import { format } from "date-fns";

interface DateObject {
  date: Date;
  notes?: string;
}

type DateTimeDropdownProps = {
  dates: DateObject[];
  selectedValue: string | undefined;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const DateTimeDropdown: React.FC<DateTimeDropdownProps> = ({
  dates,
  selectedValue,
  setSelectedValue,
}) => {
  return (
    <select
      className="border-1	rounded-md border border-black p-1 text-center text-green-700"
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      {!!dates &&
        dates.map((dateObj, index) => (
          <option key={index} value={dateObj.notes}>
            {format(dateObj.date, "PPPppp")}
          </option>
        ))}
    </select>
  );
};

export default DateTimeDropdown;
