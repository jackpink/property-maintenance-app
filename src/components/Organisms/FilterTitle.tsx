import { Dispatch, SetStateAction } from "react";
import { Collapsible, CollapsibleFilterHeader } from "../Atoms/Collapsible";
import { SearchBar } from "../Atoms/SearchBar";

export type TitleFilterValues = {
  titleValue: string;
  titleOpen: boolean;
  titleSelected: boolean;
};

const TitleFilter = ({
  filterValues,
  setFilterValues,
  parentElementOpen,
}: {
  filterValues: TitleFilterValues;
  setFilterValues: Dispatch<SetStateAction<TitleFilterValues>>;
  parentElementOpen: boolean;
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
        label={"Title: " + filterValues.titleValue}
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
    <SearchBar
      onChange={onChange}
      value={title}
      placeholder="Search by Job Title"
    />
  );
};

("Search by job title");
