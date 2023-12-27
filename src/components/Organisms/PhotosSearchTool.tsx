import { useCallback, useEffect, useState } from "react";
import { CTAButton, GhostButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { Text } from "../Atoms/Text";
import { RouterOutputs, api } from "~/utils/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RecentJobsViewer from "../Molecules/RecentJobsViewer";
import { Collapsible, CollapsibleHeader } from "../Atoms/Collapsible";
import TitleFilter, { type TitleFilterValues } from "./FilterTitle";
import RoomsFilter, { RoomsFilterValues } from "./FilterRooms";
import { Job, Room, TagEnum } from "@prisma/client";
import clsx from "clsx";
import { instanceOfTradeInfo } from "../Molecules/AddTradePopover";
import PhotoViewer from "../Molecules/PhotoViewer";
import JobsFilter, { JobsFilterValues } from "./FilterJobs";
import { set } from "date-fns";
import TagFilter, { TagFilterValues } from "./FilterTags";

type Property = RouterOutputs["property"]["getPropertyForUser"];

const PhotosSearchTool = ({ property }: { property: Property }) => {
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(true);

  const getCurrentFilters = (): {
    rooms?: string[];
    jobs?: string[];
    tag?: TagEnum;
  } => {
    let rooms;
    let jobs;
    let tag;

    searchParams.forEach((value, key) => {
      const decodedValue = decodeURIComponent(value)
        .replace("[", "")
        .replace("]", "")
        .replace(/"/g, "")
        .split(",");
      let displayedValue;
      if (key === "rooms") {
        //get names from property

        rooms = decodedValue;
      } else if (key === "jobs") {
        //title = decodedValue[0]?.toString() ?? "";
        jobs = decodedValue;
        // how to get jobIds from indexes
      } else if (key === "tag") {
        tag = (decodedValue[0]?.toString() as TagEnum) ?? undefined;
      } else {
        displayedValue = decodedValue[0]?.toString() ?? "";
      }
    });

    return { rooms, jobs, tag };
  };

  const { rooms, jobs, tag } = getCurrentFilters();

  const getRoomObjects = () => {
    if (!rooms) return [];
    const roomObjects: Room[] = [];
    rooms.forEach((roomId) => {
      const level = property.levels.find((level) =>
        level.rooms.find((room) => room.id === roomId)
      );
      if (!level) return;
      const room = level.rooms.find((room) => room.id === roomId);
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
              ? "NO FILTERS APPLIED"
              : numberOfCurrentFilters() === 1
              ? numberOfCurrentFilters().toString() + " FILTER"
              : numberOfCurrentFilters().toString() + " FILTERS"}
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
          tag={tag}
          parentElementOpen={filterOpen}
        />
      </Collapsible>
      <SearchedPhotos
        property={property}
        roomIds={rooms ?? []}
        jobIndices={jobs}
        tag={tag}
      />
    </div>
  );
};

export default PhotosSearchTool;

const SearchedPhotos = ({
  property,
  roomIds,
  jobIndices,
  tag,
}: {
  property: Property;
  roomIds: string[];
  jobIndices?: string[];
  tag?: TagEnum;
}) => {
  const {
    data: jobs,
    isLoading,
    error,
  } = api.job.getJobsForRooms.useQuery({
    roomIds: roomIds,
    tag: tag,
  });
  console.log("jobIndices", jobIndices); /// jobs need to be filtered with tag as well

  return (
    <div className="mx-auto flex max-w-4xl flex-col space-y-4 px-6 py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>error</p>
      ) : jobs ? (
        <>
          {jobs.map((job, index) => (
            <div key={index}>
              {!jobIndices ? (
                <>
                  <Text>{job.title}</Text>
                  <PhotosForJobAndRooms jobId={job.id} roomIds={roomIds} />
                </>
              ) : (
                jobIndices?.includes(index.toString()) && (
                  <>
                    <Text>{job.title}</Text>
                    <PhotosForJobAndRooms jobId={job.id} roomIds={roomIds} />
                  </>
                )
              )}
            </div>
          ))}
        </>
      ) : (
        <p>Please select some filters</p>
      )}
    </div>
  );
};

const PhotosForJobAndRooms = ({
  jobId,
  roomIds,
}: {
  jobId: string;
  roomIds: string[];
}) => {
  const {
    data: photos,
    isLoading,
    error,
  } = api.photo.getPhotosForJobAndRooms.useQuery({
    jobId: jobId,
    roomIds: roomIds,
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
        <p>Could not find photos</p>
      )}
    </div>
  );
};

const Filters = ({
  property,
  rooms,
  jobs,
  tag,
  parentElementOpen,
}: {
  property: Property;
  rooms?: Room[];
  jobs?: number[];
  tag?: TagEnum;
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
    jobsSelected: jobs ? true : false,
  });

  const [tagFilterValues, setTagFilterValues] = useState<TagFilterValues>({
    tagValue: tag ?? undefined,
    tagOpen: false,
    tagSelected: tag ? true : false,
  });

  const findLevelForRoom = (roomId: string) => {
    return property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
  };

  const setCurrentFilters = () => {
    const params = new URLSearchParams();
    const currentSelectedRooms = decodeURIComponent(
      searchParams.get("rooms") ?? ""
    )
      .replace("[", "")
      .replace("]", "")
      .replace(/"/g, "")
      .split(",");
    console.log("currentSelectedRooms", currentSelectedRooms);
    ////// LOOOOOK HEEREEE
    const roomsHasChanged =
      currentSelectedRooms
        .map(
          (roomId) =>
            roomsFilterValues.roomsValue.find((room) => room.id === roomId) ===
            undefined
        )
        .includes(true) ||
      roomsFilterValues.roomsValue
        .map(
          (room) =>
            currentSelectedRooms.find((roomId) => roomId === room.id) ===
            undefined
        )
        .includes(true);
    console.log("roomHasChanged", roomsHasChanged);
    if (roomsFilterValues.roomsSelected) {
      params.set(
        "rooms",
        encodeURIComponent(
          JSON.stringify(roomsFilterValues.roomsValue.map((room) => room.id))
        )
      );
    }
    if (roomsHasChanged) {
      setJobsFilterValues((prev) => ({
        ...prev,
        jobsValue: [],
        jobsSelected: false,
      }));
    } else if (jobsFilterValues.jobsSelected) {
      console.log("JOBS AND SLECTED", jobsFilterValues.jobsValue);
      params.set(
        "jobs",
        encodeURIComponent(JSON.stringify(jobsFilterValues.jobsValue))
      );
    } else if (tagFilterValues.tagSelected && tagFilterValues.tagValue) {
      params.set("tag", encodeURIComponent(tagFilterValues.tagValue));
    }

    //set params
    router.push(`${pathname}?${params.toString()}`);
  };

  const getCurrentFilters = () => {
    const filters: { label: string; value: string }[] = [];

    searchParams.forEach((value, key) => {
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
      } else if (key === "jobs") {
        console.log("Decoded Vlaue of jobs", decodedValue);
        displayedValue =
          decodedValue.length === 1
            ? "1 Job Selected"
            : decodedValue.length.toString() + " Jobs Selected" ?? "";
      } else if (key === "tag") {
        displayedValue = (decodedValue[0]?.toString() as TagEnum) ?? undefined;
      } else {
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
      setJobsFilterValues((prev) => ({ ...prev, jobsOpen: false }));
      setTagFilterValues((prev) => ({ ...prev, tagOpen: false }));
    }
  }, [parentElementOpen]);
  console.log("jobsFilterValues", jobsFilterValues.jobsValue);
  return (
    <>
      <CurrentFilters filters={currentFilters} />

      <RoomsFilter
        property={property}
        filterValues={roomsFilterValues}
        setFilterValues={setRoomsFilterValues}
        parentElementOpen={parentElementOpen}
      />
      <TagFilter
        property={property}
        filterValues={tagFilterValues}
        setFilterValues={setTagFilterValues}
        parentElementOpen={parentElementOpen}
      />
      <JobsFilter
        roomIds={rooms?.map((room) => room.id) ?? []}
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
