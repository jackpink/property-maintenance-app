import type { Dispatch, SetStateAction } from "react";
import { EditButton } from "../Atoms/Button";
import { ErrorMessage } from "../Atoms/Text";
import ClickAwayListener from "../ClickAwayListener";
import { TextInput } from "../Atoms/TextInput";
import Image from "next/image";
import { Text } from "../Atoms/Text";

type TextInputWithEditButtonProps = {
  label: string;
  editLabelInput: string;
  setEditLabelInput: Dispatch<SetStateAction<string>>;
  editLabelMode: boolean;
  setEditLabelMode: Dispatch<SetStateAction<boolean>>;
  textInputDisabled: boolean;
  updateLabelClickEvent: () => void;
  error: boolean;
  errorMessage: string;
};

const TextInputWithEditButton: React.FC<TextInputWithEditButtonProps> = ({
  label,
  editLabelInput,
  setEditLabelInput,
  editLabelMode,
  setEditLabelMode,
  textInputDisabled,
  updateLabelClickEvent,
  error,
  errorMessage,
}) => {
  return (
    <>
      <div className="flex justify-center">
        {editLabelMode ? (
          <ClickAwayListener clickOutsideAction={() => setEditLabelMode(false)}>
            <div className="flex">
              <TextInput
                value={editLabelInput}
                onChange={(e) => setEditLabelInput(e.currentTarget.value)}
                error={error}
                disabled={textInputDisabled}
              />
              <button onClick={() => setEditLabelMode(false)} className="px-1">
                <Image src="/cancel.svg" alt="Edit" width={40} height={40} />
              </button>
              <button onClick={updateLabelClickEvent} className="px-1">
                <Image
                  src="/check_circle.svg"
                  alt="Edit"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          </ClickAwayListener>
        ) : (
          <div className="relative mb-4 w-full">
            <Text className="text-xl font-extrabold">{label}</Text>

            <EditButton
              onClick={() => setEditLabelMode(true)}
              className="absolute right-0 top-0"
              width="35px"
              height="35px"
            />
          </div>
        )}
      </div>

      <ErrorMessage error={error} errorMessage={errorMessage} />
    </>
  );
};

export default TextInputWithEditButton;
