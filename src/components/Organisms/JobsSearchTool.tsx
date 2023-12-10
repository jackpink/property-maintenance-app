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
import TitleFilter, { type titleFilterValues } from "./FilterTitle";

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
          <div className="flex w-full">FILTER</div>
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

type roomsFilterValues = {
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
  const [titleFilterValues, setTitleFilterValues] = useState<titleFilterValues>(
    {
      titleValue: title ?? "",
      titleOpen: false,
      titleSelected: title ? true : false,
    }
  );

  const [roomsFilterValues, setRoomsFilterValues] = useState<roomsFilterValues>(
    {
      roomsValue: rooms ?? [],
      roomsOpen: false,
      roomsSelected: rooms ? true : false,
    }
  );

  const findLevelForRoom = (roomId: string) => {
    return property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
  };

  const setCurrentFilters = () => {
    const params = new URLSearchParams();
    console.log("current params", params.toString());

    if (titleFilterValues.titleSelected) {
      params.set("title", encodeURIComponent(titleFilterValues.titleValue));
    }

    if (roomsFilterValues.roomsSelected) {
      params.set(
        "rooms",
        encodeURIComponent(
          JSON.stringify(roomsFilterValues.roomsValue.map((room) => room.id))
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
        filterValues={titleFilterValues}
        setFilterValues={setTitleFilterValues}
      />
      <RoomsFilter
        property={property}
        filterValues={roomsFilterValues}
        setFilterValues={setRoomsFilterValues}
      />
      <CTAButton onClick={setCurrentFilters}>Apply Filters</CTAButton>
    </>
  );
};

const RoomsFilter = ({
  property,
  filterValues,
  setFilterValues,
}: {
  property: Property;
  filterValues: roomsFilterValues;
  setFilterValues: Dispatch<SetStateAction<roomsFilterValues>>;
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
