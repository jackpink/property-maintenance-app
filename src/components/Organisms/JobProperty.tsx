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
import { EditIconSmall } from "../Atoms/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const path = usePathname();
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
        onConfirmEdit={() => console.log("confirm")}
        editable={false}
      />
      <div className="flex w-full justify-between py-10 pl-6">
        <TabAttributeComponentLabel label="Rooms:" />

        <div className="relative text-center">
          {job.rooms.map((room, index) => {
            return (
              <p className="text-sm font-light text-slate-600" key={index}>
                {room.Level.label.toUpperCase() +
                  "→" +
                  room.label.toUpperCase()}
              </p>
            );
          })}
        </div>
        <div className="justify-self-end">
          <Link href={path + "/rooms"}>
            <EditIconSmall />
          </Link>
        </div>
      </div>
    </>
  );
}
