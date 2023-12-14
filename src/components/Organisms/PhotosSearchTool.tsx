import { useEffect, useState } from "react";
import { CTAButton, GhostButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { Text } from "../Atoms/Text";
import { RouterOutputs, api } from "~/utils/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RecentJobsViewer from "../Molecules/RecentJobsViewer";
import { Collapsible, CollapsibleHeader } from "../Atoms/Collapsible";
import TitleFilter, { type TitleFilterValues } from "./FilterTitle";
import RoomsFilter, { RoomsFilterValues } from "./FilterRooms";
import { Job, Room } from "@prisma/client";
import clsx from "clsx";
import { instanceOfTradeInfo } from "../Molecules/AddTradePopover";
import PhotoViewer from "../Molecules/PhotoViewer";
import JobsFilter, { JobsFilterValues } from "./FilterJobs";

type Property = RouterOutputs["property"]["getPropertyForUser"];

const PhotosSearchTool = ({ property }: { property: Property }) => {
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(true);

  const getCurrentFilters = (): { rooms?: string[] } => {
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
        //title = decodedValue[0]?.toString() ?? "";
      } else {
        console.log("decodedValue", decodedValue);
        displayedValue = decodedValue[0]?.toString() ?? "";
      }
    });

    return { rooms };
  };

  const { rooms } = getCurrentFilters();

  console.log("rooms", rooms);
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

  const numberOfCurrentFilters = () => {
    let count = 0;
    if (rooms) count++;
    return count;
  };

  return (
    <div className="px-1 py-4">
      <CollapsibleHeader onClick={() => setFilterOpen(!filterOpen)}>
        <CTAButton className=" w-full bg-brand/60">
          <div className="flex w-full justify-between gap-8">
            <FilterIcon />
            {numberOfCurrentFilters() === 0
              ? "NO FILTERS APLLIED"
              : numberOfCurrentFilters() === 1
              ? numberOfCurrentFilters() + " FILTER"
              : numberOfCurrentFilters() + " FILTERS"}
            <div
              className={clsx(
                "h-4 w-4 rotate-[-45deg] border-b-4 border-l-4 border-black transition-transform duration-500",
                filterOpen && "translate-y-[10px] rotate-[135deg]"
              )}
            ></div>
          </div>
        </CTAButton>
      </CollapsibleHeader>
      <Collapsible open={filterOpen}>
        <Filters
          property={property}
          rooms={roomObjects}
          parentElementOpen={filterOpen}
        />
      </Collapsible>
      <SearchedPhotos property={property} rooms={rooms} />
    </div>
  );
};

export default PhotosSearchTool;

const SearchedPhotos = ({
  property,
  rooms,
}: {
  property: Property;
  rooms?: string[];
}) => {
  const {
    data: photos,
    isLoading,
    error,
  } = api.photo.getFilteredPhotosForProperty.useQuery({
    roomIds: rooms,
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-4 px-6 py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>error</p>
      ) : photos ? (
        <>
          <PhotoViewer photos={photos} />
        </>
      ) : (
        <p>Please select some filters</p>
      )}
    </div>
  );
};

const Filters = ({
  property,
  rooms,
  jobs,
  parentElementOpen,
}: {
  property: Property;
  rooms?: Room[];
  jobs?: Job[];
  parentElementOpen: boolean;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [roomsFilterValues, setRoomsFilterValues] = useState<RoomsFilterValues>(
    {
      roomsValue: rooms ?? [],
      roomsOpen: false,
      roomsSelected: rooms ? true : false,
    }
  );

  const [jobsFilterValues, setJobsFilterValues] = useState<JobsFilterValues>({
    jobsValue: jobs ?? [],
    jobsOpen: false,
    jobsSelected: rooms ? true : false,
  });

  const findLevelForRoom = (roomId: string) => {
    return property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
  };

  const setCurrentFilters = () => {
    const params = new URLSearchParams();
    console.log("current params", params.toString());

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

  useEffect(() => {
    if (!parentElementOpen) {
      setRoomsFilterValues((prev) => ({ ...prev, roomsOpen: false }));
    }
  }, [parentElementOpen]);

  return (
    <>
      <CurrentFilters filters={currentFilters} />

      <RoomsFilter
        property={property}
        filterValues={roomsFilterValues}
        setFilterValues={setRoomsFilterValues}
        parentElementOpen={parentElementOpen}
      />
      <JobsFilter
        roomIds={roomsFilterValues.roomsValue.map((room) => room.id)}
        filterValues={jobsFilterValues}
        setFilterValues={setJobsFilterValues}
        parentElementOpen={parentElementOpen}
      />
      <CTAButton onClick={setCurrentFilters} className="w-full">
        Apply Filters
      </CTAButton>
    </>
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

  const onClickClearAll = () => {
    router.push(`${pathname}`);
  };

  const capitalise = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const addSpaces = (string: string) => {
    return string.replaceAll(",", ", ");
  };

  return (
    <div className="p-4">
      <div className="flex w-full justify-end pb-2">
        <GhostButton onClick={onClickClearAll} className="right-0">
          CLEAR FILTERS
        </GhostButton>
      </div>

      <div className="flex flex-wrap">
        {filters.map((filter, index) => (
          <div
            key={index}
            className="mb-2 mr-2 flex items-center rounded-full bg-altPrimary px-4 py-2"
          >
            <Text className="text-white">
              {capitalise(filter.label)}: {addSpaces(filter.value)}
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
    </div>
  );
};

const FilterIcon = () => (
  <svg
    width="22.686863"
    zoomAndPan="magnify"
    viewBox="0 0 22.686863 28.613504"
    height="28.613504"
    preserveAspectRatio="xMidYMid"
    version="1.0"
    id="svg2"
  >
    <defs id="defs1">
      <clipPath id="ea9d3b552b">
        <path
          d="M 97.554688,68 H 231.80469 V 217.67578 H 97.554688 Z m 0,0"
          clip-rule="nonzero"
          id="path1"
        />
      </clipPath>
    </defs>
    <g
      clip-path="url(#ea9d3b552b)"
      id="g2"
      transform="matrix(0.16962552,0,0,0.19208226,-16.607703,-13.098359)"
    >
      <path
        fill="#000000"
        d="m 180.41016,148.37109 v 0.0156 c 0,-0.008 0,-0.008 0,-0.0156 z m -31.25782,0.008 c 0,0.008 0.008,0.008 0.008,0.0156 z M 176.9375,187.5 c -0.008,0.008 -0.008,0.008 -0.0156,0.0156 z M 102.93359,72.230469 c -0.52734,0 -0.78125,0.363281 -0.85937,0.519531 -0.0859,0.160156 -0.24609,0.570312 0.0625,1.003906 l 50.34375,72.320314 c 0.33203,0.46484 0.50781,1.02734 0.50781,1.60937 v 63.69922 l 23.58594,-23.51953 v -40.17969 c 0,-0.58203 0.17578,-1.14453 0.51562,-1.61718 l 50.33594,-72.312504 c 0.30859,-0.433594 0.15234,-0.84375 0.0625,-1.003906 -0.0781,-0.15625 -0.33203,-0.519531 -0.85937,-0.519531 z m 48.82813,144.925781 c -0.36328,0 -0.72656,-0.0703 -1.08203,-0.21094 -1.0625,-0.4414 -1.74219,-1.46094 -1.74219,-2.60547 V 148.0625 L 98.808594,76.054688 c -1.070313,-1.535157 -1.195313,-3.515626 -0.328125,-5.171876 0.871093,-1.664062 2.582031,-2.691406 4.453121,-2.691406 h 123.69532 c 1.875,0 3.58203,1.027344 4.45312,2.691406 0.86719,1.65625 0.74219,3.636719 -0.32422,5.171876 L 180.625,148.0625 v 40.30469 c 0,0.75 -0.30078,1.47656 -0.83984,1.99609 l -26.03125,25.96484 c -0.54297,0.54688 -1.26563,0.82813 -1.99219,0.82813"
        fill-opacity="1"
        fill-rule="nonzero"
        id="path2"
      />
    </g>
  </svg>
);
