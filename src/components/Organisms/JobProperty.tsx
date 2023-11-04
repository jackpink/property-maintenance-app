import { RouterOutputs } from "~/utils/api";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";
import PropertyHeroWithSelectedRooms from "../Molecules/PropertyHeroWithSelectedRooms";
import { Text } from "../Atoms/Text";

import { Job } from "~/pages/homeowner/job/[index]";
import { Property } from "@prisma/client";
import JobRoomSelector from "./JobRoomSelector";

type Rooms = Job["rooms"];

type JobPropertyProps = {
  job: Job;
  jobLoading: boolean;
};

export default function JobProperty({ job, jobLoading }: JobPropertyProps) {
  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Property</PageSubTitle>
      </BackgroundContainerHeader>
      <PropertyHeroWithSelectedRooms
        property={job.Property}
        rooms={job.rooms}
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
        <JobRoomSelector job={job} jobLoading={jobLoading} />
      </div>
    </BackgroundContainer>
  );
}
