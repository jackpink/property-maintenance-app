import clsx from "clsx";
import { RouterOutputs } from "~/utils/api";
import Popover from "./Popover";
import Button from "./Button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type PropertyWithLevelAndRooms = Job["Property"];

type RoomSelectorProps = {
  property: PropertyWithLevelAndRooms;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (room: RoomFromLevels) => boolean;
};

const RoomSelector: React.FC<RoomSelectorProps> = ({
  property,
  error,
  setError,
  errorMessage,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
}) => {
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

  useEffect(() => {
    if (roomSelectorOpen === false) setError(false);
  }, [roomSelectorOpen]);

  const closePopover = () => {
    setRoomSelectorOpen(false);
    setError(false);
  };

  return (
    <div className="grid">
      <Button
        onClick={() => setRoomSelectorOpen(true)}
        className="my-6 w-48 place-self-center"
      >
        Select Rooms
      </Button>
      <Popover
        popoveropen={roomSelectorOpen}
        setPopoverOpen={setRoomSelectorOpen}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {property.levels.map((level, index) => {
            return (
              <Level
                level={level}
                key={index}
                onClickRoomAdd={onClickRoomAdd}
                onClickRoomRemove={onClickRoomRemove}
                checkRoomSelected={checkRoomSelected}
              />
            );
          })}
        </div>
        {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : <></>}
      </Popover>
    </div>
  );
};

type Level =
  RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number];

type LevelProps = {
  level: Level;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (room: RoomFromLevels) => boolean;
};

export const Level: React.FC<LevelProps> = ({
  level,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
}) => {
  return (
    <div className="w-60 text-center">
      <h1>{level?.label}</h1>
      {level?.rooms.map((room, index) => (
        <div key={index} className="grid grid-cols-1 gap-2 p-2">
          <RoomButton
            className=""
            key={index}
            room={room}
            onClickRoomAdd={onClickRoomAdd}
            onClickRoomRemove={onClickRoomRemove}
            checkRoomSelected={checkRoomSelected}
          />
        </div>
      ))}
    </div>
  );
};

export type RoomFromLevels =
  RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number]["rooms"][number];

type RoomButtonProps = {
  className: string;
  room: RoomFromLevels;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (room: RoomFromLevels) => boolean;
};

export const RoomButton: React.FC<RoomButtonProps> = ({
  className,
  room,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
}) => {
  const addRoomButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Add room to job mutation
    onClickRoomAdd(event.currentTarget.value);
  };
  const removeRoomButtonClicked = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Add room to job mutation
    onClickRoomRemove(event.currentTarget.value);
  };
  if (checkRoomSelected(room)) {
    return (
      <button
        onClick={removeRoomButtonClicked}
        value={room.id}
        className={clsx(
          className,
          "rounded border-2 border-teal-800 bg-teal-300 p-2"
        )}
      >
        {room.label}
      </button>
    );
  }
  return (
    <button
      value={room.id}
      onClick={addRoomButtonClicked}
      className={clsx(className, "rounded border border-teal-800 p-2")}
    >
      {room.label}
    </button>
  );
};

export default RoomSelector;
