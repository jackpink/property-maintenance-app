import { Room } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { RouterOutputs } from "~/utils/api";
import { Collapsible, CollapsibleFilterHeader } from "../Atoms/Collapsible";
import { RoomSelector } from "../Molecules/RoomSelector";

type Property = RouterOutputs["property"]["getPropertyForUser"];

export type RoomsFilterValues = {
  roomsValue: Room[];
  roomsOpen: boolean;
  roomsSelected: boolean;
};

const RoomsFilter = ({
  property,
  filterValues,
  setFilterValues,
}: {
  property: Property;
  filterValues: RoomsFilterValues;
  setFilterValues: Dispatch<SetStateAction<RoomsFilterValues>>;
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
            .replaceAll(",", ", ")
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

export default RoomsFilter;
