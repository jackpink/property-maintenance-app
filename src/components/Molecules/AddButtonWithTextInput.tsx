import { PropsWithChildren, useState } from "react";
import { CTAButton, PlusIcon } from "../Atoms/Button";
import { ErrorMessage } from "../Atoms/Text";
import ClickAwayListener from "../ClickAwayListener";
import { TextInput } from "../TextInput";

type AddButtonWithTextInputProps = {
  addButtonClickEvent: () => void;
  textboxOpen: boolean;
  setTextboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
  errorMessage: string;
};

const AddButtonWithTextInput: React.FC<
  PropsWithChildren<AddButtonWithTextInputProps>
> = ({
  addButtonClickEvent,
  textboxOpen,
  setTextboxOpen,
  input,
  setInput,
  error,
  errorMessage,
  children,
}) => {
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
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
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
        <>{children}</>
      )}
    </>
  );
};

export default AddButtonWithTextInput;
