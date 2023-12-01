import { useState } from "react";
import { CTAButton } from "../Atoms/Button";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import RoomSelectorPopover from "../Molecules/RoomSelector";
import clsx from "clsx";

const JobsSearchTool: React.FC = () => {
  return (
    <div>
      <Collapsible>
        <div>header</div>
        <div>content</div>
      </Collapsible>
      <Accordian>
        <AccordianHeader>
          <CTAButton className="w-full">
            <FilterIcon />
            FILTER
          </CTAButton>
        </AccordianHeader>
        <div>Conmtent</div>
      </Accordian>
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

const Collapsible: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <button onClick={() => setOpen(!open)}>{children}</button>
      <div className={clsx(open ? "block" : "hidden")}>{children}</div>
    </div>
  );
};

const Filters = () => {
  return (
    <div className="p-6">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <input
          type="search"
          className="b relative m-0 -mr-0.5 flex-auto rounded-l border border-solid border-dark bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(13,148,136)] focus:outline-none dark:border-teal-600 dark:text-teal-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="Search by job title"
          onChange={() => console.log("searching")}
        />

        <button
          className="relative z-[2] flex items-center rounded-r border border-solid border-dark bg-brand px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg"
          type="button"
          id="button-addon1"
          data-te-ripple-init
          data-te-ripple-color="light"
        >
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
        </button>
      </div>
      {propertyIsLoading ? (
        <LoadingSpinner />
      ) : propertyFetchError ? (
        <Text>{propertyFetchError?.message}</Text>
      ) : property ? (
        <RoomSelectorPopover
          property={property}
          jobLoading={false}
          loading={false}
          setLoading={() => console.log("loading")}
          onClickRoomAdd={() => console.log("add")}
          onClickRoomRemove={() => console.log("remove")}
          checkRoomSelected={() => false}
          error={roomSelectorError}
          setError={setRoomSelectorError}
          roomSelectorOpen={roomSelectorOpen}
          setRoomSelectorOpen={setRoomSelectorOpen}
          errorMessage=""
        >
          <CTAButton>Select Room</CTAButton>
        </RoomSelectorPopover>
      ) : (
        <Text>Could not load recent jobs for this property.</Text>
      )}
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
