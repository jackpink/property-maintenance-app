import { Room, TagEnum } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { RouterOutputs } from "~/utils/api";
import { Collapsible, CollapsibleFilterHeader } from "../Atoms/Collapsible";
import { RoomSelector } from "../Molecules/RoomSelector";

type Property = RouterOutputs["property"]["getPropertyForUser"];

export type TagFilterValues = {
  tagValue: TagEnum | undefined;
  tagOpen: boolean;
  tagSelected: boolean;
};

const TagFilter = ({
  property,
  filterValues,
  setFilterValues,
  parentElementOpen,
}: {
  property: Property;
  filterValues: TagFilterValues;
  setFilterValues: Dispatch<SetStateAction<TagFilterValues>>;
  parentElementOpen: boolean;
}) => {
  return (
    <div className=" mb-4 border-0 border-b-2 border-slate-400">
      <CollapsibleFilterHeader
        onClick={() =>
          setFilterValues((prev) => ({ ...prev, tagOpen: !prev.tagOpen }))
        }
        selected={filterValues.tagSelected}
        setSelected={(selected) =>
          setFilterValues((prev) => ({ ...prev, tagSelected: selected }))
        }
        open={filterValues.tagOpen}
        setOpen={(open) =>
          setFilterValues((prev) => ({ ...prev, titleOpen: open }))
        }
        label={
          filterValues.tagValue ? "Tag: " + filterValues.tagValue : "Tag: "
        }
      />
      <Collapsible open={filterValues.tagOpen}>
        <SelectableTag
          selectedTag={filterValues.tagValue}
          setFilterValues={setFilterValues}
        />
      </Collapsible>
    </div>
  );
};

export default TagFilter;

const SelectableTag: React.FC<{
  selectedTag?: TagEnum;
  setFilterValues: Dispatch<SetStateAction<TagFilterValues>>;
}> = ({ selectedTag, setFilterValues }) => {
  const tags = Object.values(TagEnum);
  return (
    <div className=" flex flex-wrap">
      {tags.map((tag, index) =>
        tag.toString() === selectedTag ? (
          <button
            key={index}
            className="m-4 rounded-lg border-2 border-altPrimary bg-brand p-1"
          >
            <span className="text-lg font-medium text-altPrimary">{tag}✓</span>
          </button>
        ) : (
          <button
            key={index}
            onClick={() =>
              setFilterValues((prev) => ({ ...prev, tagValue: tag }))
            }
            className="m-4 rounded-lg border-2 border-dark p-1 text-lg font-medium text-dark"
          >
            {tag}
          </button>
        )
      )}
    </div>
  );
};
