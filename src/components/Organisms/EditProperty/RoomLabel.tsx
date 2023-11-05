import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { EditButton } from "~/components/Atoms/Button";
import { ErrorMessage } from "~/components/Atoms/Text";
import ClickAwayListener from "~/components/ClickAwayListener";
import Image from "next/image";
import { TextInput } from "~/components/TextInput";
import { Text } from "~/components/Atoms/Text";
import { RouterOutputs, api } from "~/utils/api";
import { ValidRoomInput } from "./AddRoom";

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
              <input
                value={editLabelInput}
                onChange={(e) => setEditLabelInput(e.target.value)}
                disabled={textInputDisabled}
                className={clsx(
                  "w-full p-2 font-extrabold text-slate-900 outline-none",
                  { "border border-2 border-red-500": error }
                )}
              />
              <TextInput
                value={label}
                onChange={(e) => setEditLabelInput(e.currentTarget.value)}
                error={error}
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
          <>
            <Text className="text-xl font-extrabold">{label}</Text>

            <button className="pr-6">
              <EditButton onClick={() => setEditLabelMode(true)} />
            </button>
          </>
        )}
      </div>

      <ErrorMessage error={error} errorMessage={errorMessage} />
    </>
  );
};

export default RoomLabel;
