import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CTAButton, ExpandButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import RoomSelectorPopover from "../Molecules/RoomSelector";
import { Text } from "../Atoms/Text";
import clsx from "clsx";
import { set } from "date-fns";
import { Room } from "@prisma/client";
import { RoomSelector } from "../Molecules/RoomSelector";
import { RouterOutputs, api } from "~/utils/api";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { unknown } from "zod";
import { on } from "events";
import RecentJobsViewer from "../Molecules/RecentJobsViewer";
import {
  Collapsible,
  CollapsibleFilterHeader,
  CollapsibleHeader,
} from "../Atoms/Collapsible";

type Property = RouterOutputs["property"]["getPropertyForUser"];

const JobsSearchTool = ({ property }: { property: Property }) => {
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(true);

  const getCurrentFilters = (): { title?: string; rooms?: string[] } => {
    let title;
    let rooms;
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

        rooms = decodedValue;
        console.log("displayedValue", displayedValue);
      } else if (key === "title") {
        title = decodedValue[0]?.toString() ?? "";
      } else {
        console.log("decodedValue", decodedValue);
        displayedValue = decodedValue[0]?.toString() ?? "";
      }
    });

    return { title, rooms };
  };

  const { title, rooms } = getCurrentFilters();

  console.log("rooms", rooms);
  console.log("title", title);

  const getRoomObjects = () => {
    if (!rooms) return [];
    const roomObjects: Room[] = [];
    rooms.forEach((roomId) => {
      const level = property.levels.find((level) =>
        level.rooms.find((room) => room.id === roomId)
      );
      if (!level) return;
      const room = level.rooms.find((room) => room.id === roomId);
      console.log("room", room);
      if (room) {
        roomObjects.push(room);
      }
    });
    return roomObjects;
  };

  const roomObjects = getRoomObjects();

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
        <Filters property={property} title={title} rooms={roomObjects} />
      </Collapsible>
      <SearchedJobs property={property} title={title} rooms={rooms} />
    </div>
  );
};

export default JobsSearchTool;

const SearchedJobs = ({
  property,
  title,
  rooms,
}: {
  property: Property;
  title?: string;
  rooms?: string[];
}) => {
  const { data, isLoading, error } =
    api.job.getFilteredJobsforProperty.useQuery({
      propertyId: property.id,
      title: title,
      rooms: rooms,
    });

  return (
    <div className="flex flex-col space-y-4">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>error</p>
      ) : data ? (
        <>
          <RecentJobsViewer recentJobs={data} />
        </>
      ) : (
        <p>Please select some filters</p>
      )}
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

const Filters = ({
  property,
  title,
  rooms,
}: {
  property: Property;
  title?: string;
  rooms?: Room[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    titleValue: title ?? "",
    titleOpen: false,
    titleSelected: title ? true : false,
    roomsValue: rooms ?? [],
    roomsOpen: false,
    roomsSelected: rooms ? true : false,
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
        <TitleSearchBar
          onChange={titleSearchOnChange}
          title={filterValues.titleValue}
        />
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
