import { useState } from "react";
import { CTAButton, PlusIcon } from "../Atoms/Button";
import { ErrorMessage } from "../Atoms/Text";
import ClickAwayListener from "../ClickAwayListener";
import { TextInput } from "../TextInput";

type AddButtonWithTextInputProps = {
  addButtonClickEvent: () => void;
};

const AddButtonWithTextInput: React.FC<AddButtonWithTextInputProps> = ({
  addButtonClickEvent,
}) => {
  const [textboxOpen, setTextboxOpen] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");
  const ToggleTextboxOpen = () => {
    //toggle textboxOpen
    setTextboxOpen(!textboxOpen);
  };

  return (
    <>
      {textboxOpen ? (
        <ClickAwayListener clickOutsideAction={() => setTextboxOpen(false)}>
          <div className="flex">
            <TextInput
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.currentTarget.value)}
              error={error}
              type="text"
            />

            <CTAButton onClick={addButtonClickEvent}>
              <PlusIcon />
            </CTAButton>
          </div>
          <ErrorMessage error={error} errorMessage={errorMessage} />
        </ClickAwayListener>
      ) : (
        <CTAButton onClick={ToggleTextboxOpen}>+ Add Room</CTAButton>
      )}
    </>
  );
};

export default AddButtonWithTextInput;
