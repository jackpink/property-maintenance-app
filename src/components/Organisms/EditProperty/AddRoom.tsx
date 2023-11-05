import { useState } from "react";
import { z } from "zod";
import { CTAButton } from "~/components/Atoms/Button";
import AddButtonWithTextInput from "~/components/Molecules/AddButtonWithTextInput";
import { api } from "~/utils/api";

export const ValidRoomInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

type AddRoomButtonProps = {
  levelId: string;
};

const AddRoomButton: React.FC<AddRoomButtonProps> = ({ levelId }) => {
  const [roomNameInput, setRoomNameInput] = useState("");
  const [textboxOpen, setTextboxOpen] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");

  const ctx = api.useContext();

  const { mutate: createRoom, isLoading: isCreatingRoom } =
    api.property.createRoomForLevel.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        setTextboxOpen(false);
        // refetch our property
        void ctx.property.getPropertyForUser.invalidate();
      },
    });

  const addRoomClickEvent = () => {
    // Check The Room input for correctness
    const checkAddRoomInput = ValidRoomInput.safeParse(roomNameInput);
    if (!checkAddRoomInput.success) {
      console.log("throw error onm input");
      const errorFormatted = checkAddRoomInput.error.format()._errors.pop();
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
    } else {
      console.log("add room ", roomNameInput);
      createRoom({
        label: roomNameInput,
        levelId: levelId,
      });
    }
  };
  return (
    <>
      <AddButtonWithTextInput
        addButtonClickEvent={addRoomClickEvent}
        input={roomNameInput}
        setInput={setRoomNameInput}
        error={error}
        errorMessage={errorMessage}
        textboxOpen={textboxOpen}
        setTextboxOpen={setTextboxOpen}
      >
        <CTAButton onClick={() => setTextboxOpen(true)}>+ Add Room</CTAButton>
      </AddButtonWithTextInput>
    </>
  );
};

export default AddRoomButton;
