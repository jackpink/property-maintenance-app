import { Dispatch, SetStateAction } from "react";
import { Collapsible, CollapsibleFilterHeader } from "../Atoms/Collapsible";

export type titleFilterValues = {
  titleValue: string;
  titleOpen: boolean;
  titleSelected: boolean;
};

const TitleFilter = ({
  filterValues,
  setFilterValues,
}: {
  filterValues: titleFilterValues;
  setFilterValues: Dispatch<SetStateAction<titleFilterValues>>;
}) => {
  const titleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value?.toString() ?? "";
    setFilterValues((prev) => ({ ...prev, titleValue: text }));
  };

  return (
    <div className="mb-4 border-0 border-b-2 border-slate-400">
      <CollapsibleFilterHeader
        onClick={() =>
          setFilterValues((prev) => ({ ...prev, titleOpen: !prev.titleOpen }))
        }
        selected={filterValues.titleSelected}
        setSelected={(selected) =>
          setFilterValues((prev) => ({ ...prev, titleSelected: selected }))
        }
        open={filterValues.titleOpen}
        setOpen={(open) =>
          setFilterValues((prev) => ({ ...prev, titleOpen: open }))
        }
        label={"Job Title: " + filterValues.titleValue}
      />
      <Collapsible open={filterValues.titleOpen}>
        <TitleSearchBar
          onChange={titleSearchOnChange}
          title={filterValues.titleValue}
        />
      </Collapsible>
    </div>
  );
};

export default TitleFilter;

const TitleSearchBar = ({
  onChange,
  title,
}: {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}) => {
  return (
    <div className="relative mb-4 flex w-full flex-wrap items-stretch rounded-full border-2 border-dark p-2">
      <FilterIcon />
      <input
        type="search"
        value={title}
        className="relative m-0 -mr-0.5 flex-auto rounded-l border border-solid border-none  bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 transition duration-200 ease-in-out focus:z-[3]  focus:text-neutral-700  focus:outline-none"
        placeholder="Search by job title"
        onChange={onChange}
      />
    </div>
  );
};

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="#000000"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
);
