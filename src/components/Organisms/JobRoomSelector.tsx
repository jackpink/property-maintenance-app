import { useCallback, useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import RoomSelector from "../Molecules/RoomSelector";
import { CTAButton } from "../Atoms/Button";

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type JobRoomSelectorProps = {
  job: Job;
  jobLoading: boolean;
};

export default function JobRoomSelector({
  job,
  jobLoading,
}: JobRoomSelectorProps) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "You cannot remove room which has photos linked to it, please remove photos first"
  );
  const [loading, setLoading] = useState(false);
  const [roomSelectorOpen, setRoomSelectorOpen] = useState(false);

  const ctx = api.useContext();

  const { mutate: addRoomToJob } = api.job.addRoomToJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      setError(false);
      void ctx.job.getJobForHomeowner.invalidate();
      setLoading(false);
      // close popover
      //closePopover();
    },
  });

  const { mutate: removeRoomFromJob } = api.job.removeRoomFromJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      setError(false);
      void ctx.job.getJobForHomeowner.invalidate();
      setLoading(false);
      // close popover
      // closePopover();
    },
    onError: (error) => {
      console.log(error);
      setError(true);
      setLoading(false);
    },
  });

  const onClickRoomAdd = (roomId: string) => {
    addRoomToJob({ jobId: job.id, roomId: roomId });
    console.log("new room added to job");
  };

  const onClickRoomRemove = (roomId: string) => {
    removeRoomFromJob({ jobId: job.id, roomId: roomId });
  };

  const checkRoomIsSelectedRoom = useCallback(
    (roomId: string) => {
      const result = job.rooms.find(
        (selectedRoom) => selectedRoom.id === roomId
      );
      return !!result;
    },
    [job.rooms]
  );

  return (
    <RoomSelector
      property={job.Property}
      error={error}
      setError={setError}
      errorMessage={errorMessage}
      jobLoading={jobLoading}
      loading={loading}
      setLoading={setLoading}
      onClickRoomAdd={onClickRoomAdd}
      onClickRoomRemove={onClickRoomRemove}
      checkRoomSelected={checkRoomIsSelectedRoom}
      roomSelectorOpen={roomSelectorOpen}
      setRoomSelectorOpen={setRoomSelectorOpen}
    >
      <CTAButton
        onClick={() => setRoomSelectorOpen(true)}
        className="my-6 w-48 place-self-center"
      >
        Select Rooms
      </CTAButton>
    </RoomSelector>
  );
}
