import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { ValidRoomInput } from "./AddRoom";
import TextInputWithEditButton from "~/components/Molecules/TextInputWithEditButton";

type Room =
  RouterOutputs["property"]["getPropertyForUser"]["levels"][number]["rooms"][number];

type RoomLabelProps = {
  room: Room;
  editPropertyMode: boolean;
};

const RoomLabel: React.FC<RoomLabelProps> = ({ room, editPropertyMode }) => {
  const [editLabelMode, setEditLabelMode] = useState(false);
  const [editLabelInput, setEditLabelInput] = useState(room.label);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");

  const ctx = api.useContext();

  const { mutate: updateRoom, isLoading: isUpdatingRoom } =
    api.property.updateRoomLabel.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        setEditLabelMode(false);
        // refetch our property
        void ctx.property.getPropertyForUser.invalidate();
      },
    });

  const cancelEditLabelMode = () => {
    setEditLabelMode(false);
    setEditLabelInput(room.label);
    setError(false);
    console.log("room label set to", room.label);
  };

  const updateRoomClickEvent = () => {
    // Check The Room input for correctness
    const checkEditRoomInput = ValidRoomInput.safeParse(editLabelInput);
    if (!checkEditRoomInput.success) {
      console.log("throw error onm input");
      const errorFormatted = checkEditRoomInput.error.format()._errors.pop();
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
    } else {
      console.log("add room ", editLabelInput);
      updateRoom({
        newLabel: editLabelInput,
        roomId: room.id,
      });
    }
  };

  return (
    <>
      <TextInputWithEditButton
        label={room.label}
        editLabelInput={editLabelInput}
        setEditLabelInput={setEditLabelInput}
        editLabelMode={editLabelMode}
        setEditLabelMode={setEditLabelMode}
        textInputDisabled={isUpdatingRoom}
        updateLabelClickEvent={updateRoomClickEvent}
        error={error}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default RoomLabel;
