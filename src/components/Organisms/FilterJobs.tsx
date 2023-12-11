import { Job, Room } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { Collapsible, CollapsibleFilterHeader } from "../Atoms/Collapsible";
import { RoomSelector } from "../Molecules/RoomSelector";
import Jobs from "../Jobs";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { Text } from "../Atoms/Text";

type Property = RouterOutputs["property"]["getPropertyForUser"];

export type JobsFilterValues = {
  jobsValue: Job[];
  jobsOpen: boolean;
  jobsSelected: boolean;
};

const JobsFilter = ({
  roomIds,
  filterValues,
  setFilterValues,
  parentElementOpen,
}: {
  roomIds: string[];
  filterValues: JobsFilterValues;
  setFilterValues: Dispatch<SetStateAction<JobsFilterValues>>;
  parentElementOpen: boolean;
}) => {
  const {
    data: jobs,
    isLoading,
    error,
  } = api.job.getJobsForRooms.useQuery({ roomIds: roomIds });

  return (
    <div className=" mb-4 border-0 border-b-2 border-slate-400">
      <CollapsibleFilterHeader
        onClick={() =>
          setFilterValues((prev) => ({ ...prev, jobsOpen: !prev.jobsOpen }))
        }
        selected={filterValues.jobsSelected}
        setSelected={(selected) =>
          setFilterValues((prev) => ({ ...prev, jobsSelected: selected }))
        }
        open={filterValues.jobsOpen}
        setOpen={(open) =>
          setFilterValues((prev) => ({ ...prev, jobsOpen: open }))
        }
        label={
          "Rooms: " +
          filterValues.jobsValue
            .map((job) => job.title)
            .concat()
            .toString()
            .replaceAll(",", ", ")
        }
      />
      <Collapsible open={filterValues.jobsOpen && parentElementOpen}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <Text>{error?.message}</Text>
        ) : jobs ? (
          <Jobs jobs={jobs} selectedJobs={} setSelectedJobs={} />
        ) : (
          <Text>Could not load jobs.</Text>
        )}
      </Collapsible>
    </div>
  );
};

export default JobsFilter;
