import { RouterOutputs } from "~/utils/api";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";
import PropertyHeroWithSelectedRooms from "../Molecules/PropertyHeroWithSelectedRooms";
import { Text } from "../Atoms/Text";

import { Job } from "~/pages/job/[index]";
import { Property } from "@prisma/client";
import JobRoomSelectorPopover from "./JobRoomSelectorPopover";
import {
  TabAttributeComponent,
  TabAttributeComponentLabel,
  TabAttributeComponentValue,
} from "../Atoms/TabLists";
import { concatAddress } from "~/utils/utits";

type Rooms = Job["rooms"];

type JobPropertyProps = {
  job: Job;
  jobLoading: boolean;
  disabled?: boolean;
};

export default function JobProperty({
  job,
  jobLoading,
  disabled = false,
}: JobPropertyProps) {
  return (
    <>
      <TabAttributeComponent
        title="Property"
        StandardComponent={
          <>
            <TabAttributeComponentLabel label="Property:" />
            <TabAttributeComponentValue value={concatAddress(job.Property)} />
          </>
        }
        EditableComponent={null}
        exists={true}
        onConfirmEdit={() => {}}
        editable={false}
      />

      <Text className="p-3 text-lg font-extrabold ">Rooms Included in Job</Text>
      <div className="relative text-center">
        {job.rooms.map((room, index) => {
          return (
            <p className="text-xs font-light text-slate-600" key={index}>
              {room.Level.label.toUpperCase() + "→" + room.label.toUpperCase()}
            </p>
          );
        })}
      </div>
    </>
  );
}
