import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CTAButton, ExpandButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import RoomSelectorPopover from "../Molecules/RoomSelector";
import { Text } from "../Atoms/Text";
import clsx from "clsx";
import { set } from "date-fns";
import { Room } from "@prisma/client";
import { RoomSelector } from "../Molecules/RoomSelector";
import { RouterOutputs } from "~/utils/api";
import { title } from "process";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { unknown } from "zod";
import { on } from "events";

type Property = RouterOutputs["property"]["getPropertyForUser"];

const JobsSearchTool = ({ property }: { property: Property }) => {
  const [filterOpen, setFilterOpen] = useState(true);
  return (
    <div>
      <CollapsibleHeader onClick={() => setFilterOpen(!filterOpen)}>
        <CTAButton className="w-full">
          <div className="flex w-full">
            <FilterIcon />
            FILTER
          </div>
        </CTAButton>
      </CollapsibleHeader>
      <Collapsible open={filterOpen}>
        <Filters property={property} />
      </Collapsible>
    </div>
  );
};

export default JobsSearchTool;

const Accordian: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <details className="duration-500 " style={{ listStyle: "none" }}>
      {children}
    </details>
  );
};

const AccordianHeader: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <summary
      style={{ listStyle: "none" }}
      className="cursor-pointer bg-inherit px-5 py-3 text-lg"
    >
      {children}
    </summary>
  );
};

const Collapsible: React.FC<React.PropsWithChildren<{ open: boolean }>> = ({
  children,
  open,
}) => {
  return (
    <div
      className={clsx(
        open ? "visible max-h-full" : "invisible max-h-0",
        "transition-all duration-300"
      )}
    >
      {children}
    </div>
  );
};

const CollapsibleHeader: React.FC<
  React.PropsWithChildren<{ onClick: () => void }>
> = ({ children, onClick }) => {
  return (
    <button className="w-full" onClick={onClick}>
      {children}
    </button>
  );
};

const CollapsibleFilterHeader: React.FC<{
  onClick: () => void;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
}> = ({ onClick, selected, setSelected, open, setOpen, label }) => {
  return (
    <div className="flex px-4 py-2">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => setSelected(e.currentTarget.checked)}
        className="h-8 w-8"
      />

      <button className="flex w-full" onClick={onClick}>
        <Text className="grow pl-4">{label}</Text>

        <ExpandButton isOpen={open} setIsOpen={setOpen} />
      </button>
    </div>
  );
};

type Filter = {
  label: string;
  value: string[];
  open: boolean;
  selected: boolean;
  filterComponent?: JSX.Element;
};

type FilterValues = {
  titleValue: string;
  titleOpen: boolean;
  titleSelected: boolean;
  roomsValue: Room[];
  roomsOpen: boolean;
  roomsSelected: boolean;
};

const Filters = ({ property }: { property: Property }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    titleValue: "",
    titleOpen: false,
    titleSelected: false,
    roomsValue: [],
    roomsOpen: false,
    roomsSelected: false,
  });

  const findLevelForRoom = (roomId: string) => {
    return property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
  };

  const setCurrentFilters = () => {
    const params = new URLSearchParams();
    console.log("current params", params.toString());

    if (filterValues.titleSelected) {
      params.set("title", encodeURIComponent(filterValues.titleValue));
    }

    if (filterValues.roomsSelected) {
      params.set(
        "rooms",
        encodeURIComponent(
          JSON.stringify(filterValues.roomsValue.map((room) => room.id))
        )
      );
    }

    //set params
    router.push(`${pathname}?${params.toString()}`);
  };

  const getCurrentFilters = () => {
    const filters: { label: string; value: string }[] = [];
    console.log("search params", searchParams.entries().next().value);
    searchParams.forEach((value, key) => {
      console.log("key", key);
      console.log("value", decodeURIComponent(value));
      const decodedValue = decodeURIComponent(value)
        .replace("[", "")
        .replace("]", "")
        .replace(/"/g, "")
        .split(",");
      let displayedValue;
      if (key === "rooms") {
        //get names from property
        displayedValue =
          decodedValue
            .map(
              (roomId) =>
                findLevelForRoom(roomId)?.rooms.find(
                  (room) => room.id === roomId
                )?.label
            )
            .concat()
            .toString() ?? "";
        console.log("displayedValue", displayedValue);
      } else {
        console.log("decodedValue", decodedValue);
        displayedValue = decodedValue[0]?.toString() ?? "";
      }
      if (key !== "property") {
        filters.push({
          label: key,
          value: displayedValue,
        });
      }
    });

    return filters;
  };

  const currentFilters = getCurrentFilters();

  return (
    <>
      <CurrentFilters filters={currentFilters} />
      <TitleFilter
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <RoomsFilter
        property={property}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <CTAButton onClick={setCurrentFilters}>Apply Filters</CTAButton>
    </>
  );
};

const TitleFilter = ({
  filterValues,
  setFilterValues,
}: {
  filterValues: FilterValues;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
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
        <TitleSearchBar onChange={titleSearchOnChange} />
      </Collapsible>
    </div>
  );
};

const RoomsFilter = ({
  property,
  filterValues,
  setFilterValues,
}: {
  property: Property;
  filterValues: FilterValues;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
}) => {
  const onClickRoomAdd = (roomId: string) => {
    const level = property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
    if (!level) return;
    const room = level.rooms.find((room) => room.id === roomId);
    console.log("room", room);
    if (room) {
      setFilterValues((prev) => ({
        ...prev,
        roomsValue: [...prev.roomsValue, room],
      }));
    }
  };

  const onClickRoomRemove = (roomId: string) => {
    setFilterValues((prev) => ({
      ...prev,
      roomsValue: prev.roomsValue.filter((room) => room.id !== roomId),
    }));
  };

  const checkRoomSelected = (roomId: string) => {
    return (
      filterValues.roomsValue.find((room) => room.id === roomId) !== undefined
    );
  };

  return (
    <div className="mb-4 border-0 border-b-2 border-slate-400">
      <CollapsibleFilterHeader
        onClick={() =>
          setFilterValues((prev) => ({ ...prev, roomsOpen: !prev.roomsOpen }))
        }
        selected={filterValues.roomsSelected}
        setSelected={(selected) =>
          setFilterValues((prev) => ({ ...prev, roomsSelected: selected }))
        }
        open={filterValues.roomsOpen}
        setOpen={(open) =>
          setFilterValues((prev) => ({ ...prev, roomsOpen: open }))
        }
        label={
          "Rooms: " +
          filterValues.roomsValue
            .map((room) => room.label)
            .concat()
            .toString()
        }
      />
      <Collapsible open={filterValues.roomsOpen}>
        <RoomSelector
          property={property}
          onClickRoomAdd={onClickRoomAdd}
          onClickRoomRemove={onClickRoomRemove}
          loading={false}
          setLoading={() => {}}
          checkRoomSelected={checkRoomSelected}
        />
      </Collapsible>
    </div>
  );
};

type CurrentFiltersProps = {
  filters: { label: string; value: string }[];
};

const CurrentFilters = ({ filters }: CurrentFiltersProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onClickClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.value);
    //remove filter from url
    const params = new URLSearchParams(searchParams.toString());
    params.delete(e.currentTarget.value);
    //set params
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex flex-wrap">
      {filters.map((filter, index) => (
        <div
          key={index}
          className="mb-2 mr-2 flex items-center rounded-full bg-altPrimary px-4 py-2"
        >
          <Text className="text-white">
            {filter.label}: {filter.value}
          </Text>
          <button
            value={filter.label}
            onClick={onClickClose}
            className="ml-2 text-white"
          >
            X
          </button>
        </div>
      ))}
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

const TitleSearchBar = ({
  onChange,
}: {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="relative mb-4 flex w-full flex-wrap items-stretch rounded-full border-2 border-dark p-2">
      <FilterIcon />
      <input
        type="search"
        className="relative m-0 -mr-0.5 flex-auto rounded-l border border-solid border-none  bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 transition duration-200 ease-in-out focus:z-[3]  focus:text-neutral-700  focus:outline-none"
        placeholder="Search by job title"
        onChange={onChange}
      />
    </div>
  );
};
