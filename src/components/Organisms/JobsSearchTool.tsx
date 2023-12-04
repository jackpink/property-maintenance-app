import { Dispatch, SetStateAction, useState } from "react";
import { CTAButton, ExpandButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import RoomSelectorPopover from "../Molecules/RoomSelector";
import { Text } from "../Atoms/Text";
import clsx from "clsx";
import { set } from "date-fns";
import { Room } from "@prisma/client";
import { RoomSelector } from "../Molecules/RoomSelector";
import { RouterOutputs } from "~/utils/api";

type Property = RouterOutputs["property"]["getPropertyForUser"];

const JobsSearchTool = ({ property }: { property: Property }) => {
  const [filterOpen, setFilterOpen] = useState(false);
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
  setSelected: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
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

const Filters = ({ property }: { property: Property }) => {
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([]);
  const [titleFilterOpen, setTitleFilterOpen] = useState(false);
  const [titleFilterSelected, setTitleFilterSelected] = useState(false);
  const [titleFilter, setTitleFilter] = useState("");
  const [roomsFilter, setRoomsFilter] = useState<Room[]>([]);
  const [roomsFilterOpen, setRoomsFilterOpen] = useState(false);
  const [roomsFilterSelected, setRoomsFilterSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const getCurrentFilters = () => {
    const filters = [];
    if (titleFilterSelected) {
      filters.push({ name: "Job Title", value: titleFilter });
    }
    if (roomsFilterSelected) {
      filters.push({
        name: "Rooms",
        value: roomsFilter.map((r) => r.label).join(", "),
      });
    }
    setCurrentFilters(filters);
  };

  const findLevelForRoom = (roomId: string) => {
    return property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
  };

  const onClickRoomAdd = (roomId: string) => {
    const level = property.levels.find((level) =>
      level.rooms.find((room) => room.id === roomId)
    );
    if (!level) return;
    const room = level.rooms.find((room) => room.id === roomId);
    if (room) {
      setRoomsFilter([...roomsFilter, room]);
      setLoading(false);
    }
  };

  const onClickRoomRemove = (roomId: string) => {
    setRoomsFilter(roomsFilter.filter((room) => room.id !== roomId));
    setLoading(false);
  };

  return (
    <div className="p-4">
      <CurrentFilters filters={currentFilters} />
      <div className="mb-4 border-0 border-b-2 border-slate-400">
        <CollapsibleFilterHeader
          onClick={() => setTitleFilterOpen(!titleFilterOpen)}
          selected={titleFilterSelected}
          setSelected={setTitleFilterSelected}
          open={titleFilterOpen}
          setOpen={setTitleFilterOpen}
          label={"Job Title: " + titleFilter}
        />
        <Collapsible open={titleFilterOpen}>
          <TitleSearchBar
            onChange={(e) => setTitleFilter(e.currentTarget.value)}
          />
        </Collapsible>
      </div>
      <div className="mb-4 border-0 border-b-2 border-slate-400">
        <CollapsibleFilterHeader
          onClick={() => setRoomsFilterOpen(!roomsFilterOpen)}
          selected={roomsFilterSelected}
          setSelected={setRoomsFilterSelected}
          open={roomsFilterOpen}
          setOpen={setRoomsFilterOpen}
          label={"Rooms: " + roomsFilter.map((room) => room.label).join(", ")}
        />
        <Collapsible open={roomsFilterOpen}>
          <RoomSelector
            property={property}
            onClickRoomAdd={onClickRoomAdd}
            onClickRoomRemove={onClickRoomRemove}
            loading={loading}
            setLoading={setLoading}
            checkRoomSelected={(roomId) =>
              roomsFilter.find((room) => room.id === roomId) !== undefined
            }
          />
        </Collapsible>
      </div>
      <CTAButton onClick={getCurrentFilters} className="w-full">
        Apply Filters
      </CTAButton>
    </div>
  );
};

interface Filter {
  name: string;
  value: string;
}

type CurrentFiltersProps = {
  filters: Filter[];
};

const CurrentFilters = ({ filters }: CurrentFiltersProps) => {
  return (
    <div className="flex flex-wrap">
      {filters.map((filter, index) => (
        <div className="mb-2 mr-2 flex items-center rounded-full bg-slate-400 px-4 py-2">
          <Text className="text-white">
            {filter.name}: {filter.value}
          </Text>
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