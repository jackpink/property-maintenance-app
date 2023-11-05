import clsx from "clsx";
import { RouterOutputs } from "~/utils/api";
import Popover from "../Atoms/Popover";
import { CTAButton } from "../Atoms/Button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ErrorMessage } from "../Atoms/Text";
import { Job } from "~/pages/job/[index]";
import { Text } from "../Atoms/Text";

export type PropertyWithLevelAndRooms = Job["Property"];

type RoomSelectorPopoverProps = {
  property: PropertyWithLevelAndRooms;
  error: boolean;
  setError: Dispatch<SetStateAction<boolean>>;
  jobLoading?: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (roomId: string) => boolean;
  roomSelectorOpen: boolean;
  setRoomSelectorOpen: Dispatch<SetStateAction<boolean>>;
};

const RoomSelectorPopover: React.FC<
  React.PropsWithChildren<RoomSelectorPopoverProps>
> = ({
  property,
  error,
  setError,
  errorMessage,
  jobLoading,
  loading,
  setLoading,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
  roomSelectorOpen,
  setRoomSelectorOpen,
  children,
}) => {
  useEffect(() => {
    if (roomSelectorOpen === false) setError(false);
  }, [roomSelectorOpen]);

  return (
    <>
      {children}
      <Popover
        popoveropen={roomSelectorOpen}
        setPopoverOpen={setRoomSelectorOpen}
      >
        <RoomSelector
          property={property}
          jobLoading={jobLoading}
          loading={loading}
          setLoading={setLoading}
          onClickRoomAdd={onClickRoomAdd}
          onClickRoomRemove={onClickRoomRemove}
          checkRoomSelected={checkRoomSelected}
        />
        <ErrorMessage error={error} errorMessage={errorMessage} />
      </Popover>
    </>
  );
};

type RoomSelectorProps = {
  property: PropertyWithLevelAndRooms;
  jobLoading?: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (roomId: string) => boolean;
};

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  property,
  jobLoading,
  loading,
  setLoading,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {property.levels.map((level, index) => {
        return (
          <Level
            level={level}
            key={index}
            onClickRoomAdd={onClickRoomAdd}
            onClickRoomRemove={onClickRoomRemove}
            checkRoomSelected={checkRoomSelected}
            jobLoading={jobLoading ? true : false}
            loading={loading}
            setLoading={setLoading}
          />
        );
      })}
    </div>
  );
};

type Level =
  RouterOutputs["job"]["getJobForTradeUser"]["Property"]["levels"][number];

type LevelProps = {
  level: Level;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (roomId: string) => boolean;
  jobLoading: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const Level: React.FC<LevelProps> = ({
  level,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
  jobLoading,
  loading,
  setLoading,
}) => {
  return (
    <div className="w-60 text-center">
      <Text className="text-large font-extrabold">{level?.label}</Text>
      {level?.rooms.map((room, index) => (
        <div key={index} className="grid grid-cols-1 gap-2 p-2">
          <RoomButton
            className=""
            key={index}
            room={room}
            onClickRoomAdd={onClickRoomAdd}
            onClickRoomRemove={onClickRoomRemove}
            checkRoomSelected={checkRoomSelected}
            jobLoading={jobLoading}
            loading={loading}
            setLoading={setLoading}
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
  jobLoading: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (roomId: string) => boolean;
};

export const RoomButton: React.FC<RoomButtonProps> = ({
  className,
  room,
  jobLoading,
  loading,
  setLoading,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
}) => {
  const addRoomButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Add room to job mutation
    setLoading(true);
    onClickRoomAdd(event.currentTarget.value);
  };
  const removeRoomButtonClicked = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Add room to job mutation
    setLoading(true);
    onClickRoomRemove(event.currentTarget.value);
  };
  if (checkRoomSelected(room.id)) {
    return (
      <CTAButton
        onClick={removeRoomButtonClicked}
        value={room.id}
        className={clsx(className, "border-2")}
        loading={loading || jobLoading}
      >
        {room.label}
      </CTAButton>
    );
  }
  return (
    <CTAButton
      value={room.id}
      onClick={addRoomButtonClicked}
      className={clsx(className, "bg-white")}
      loading={loading || jobLoading}
    >
      {room.label}
    </CTAButton>
  );
};

export default RoomSelectorPopover;
