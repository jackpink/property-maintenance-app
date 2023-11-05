import { type RouterOutputs, api } from "~/utils/api";
import clsx from "clsx";
import { type Dispatch, type SetStateAction, useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { CTAButton, PlusIcon } from "./Atoms/Button";
import ClickAwayListener from "./ClickAwayListener";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./Atoms/Text";

// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

type AddRoomTextInputProps = {
  ToggleTextboxOpen: () => void;
  levelId: string;
};

const ValidRoomInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

const AddRoomTextInput: React.FC<AddRoomTextInputProps> = ({
  ToggleTextboxOpen,
  levelId,
}) => {
  const [roomNameInput, setRoomNameInput] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");

  const ctx = api.useContext();

  const { mutate: createRoom, isLoading: isCreatingRoom } =
    api.property.createRoomForLevel.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        ToggleTextboxOpen();
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
    <div className="w-full ">
      <ClickAwayListener clickOutsideAction={ToggleTextboxOpen}>
        <div className="flex">
          <input
            onChange={(e) => setRoomNameInput(e.target.value)}
            disabled={isCreatingRoom}
            className={clsx(
              "w-full p-2 font-extrabold text-slate-900 outline-none",
              { "border border-2 border-red-500": error }
            )}
          />
          <CTAButton onClick={addRoomClickEvent}>+</CTAButton>
        </div>
      </ClickAwayListener>
      {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : null}
    </div>
  );
};

type AddRoomButtonProps = {
  levelId: string;
};

const AddRoomButton: React.FC<AddRoomButtonProps> = ({ levelId }) => {
  const [textboxOpen, setTextboxOpen] = useState(false);
  const [roomNameInput, setRoomNameInput] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");
  const ToggleTextboxOpen = () => {
    //toggle textboxOpen
    setTextboxOpen(!textboxOpen);
  };
  const ctx = api.useContext();

  const { mutate: createRoom, isLoading: isCreatingRoom } =
    api.property.createRoomForLevel.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        ToggleTextboxOpen();
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
      {textboxOpen ? (
        <ClickAwayListener clickOutsideAction={() => setTextboxOpen(false)}>
          <div className="flex">
            <TextInput
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.currentTarget.value)}
              error={error}
              type="text"
            />

            <CTAButton onClick={addRoomClickEvent}>
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
type Room =
  RouterOutputs["property"]["getPropertyForUser"]["levels"][number]["rooms"][number];

type RoomProps = {
  room: Room;
  editPropertyMode: boolean;
};

const Room: React.FC<RoomProps> = ({ room, editPropertyMode }) => {
  const [editLabelMode, setEditLabelMode] = useState(false);
  const [editLabelInput, setEditLabelInput] = useState(room.label);

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");

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
      <div className="flex justify-center">
        {editLabelMode ? (
          <ClickAwayListener clickOutsideAction={cancelEditLabelMode}>
            <div className="flex">
              <input
                value={editLabelInput}
                onChange={(e) => setEditLabelInput(e.target.value)}
                disabled={isUpdatingRoom}
                className={clsx(
                  "w-full p-2 font-extrabold text-slate-900 outline-none",
                  { "border border-2 border-red-500": error }
                )}
              />
              <button onClick={cancelEditLabelMode} className="px-1">
                <Image src="/cancel.svg" alt="Edit" width={40} height={40} />
              </button>
              <button onClick={updateRoomClickEvent} className="px-1">
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
            <p className="rounded  p-2 text-xl font-extrabold text-slate-900">
              {room.label}
            </p>
            {editPropertyMode ? (
              <button onClick={() => setEditLabelMode(true)} className="pr-6">
                <Image
                  src="/edit_button.svg"
                  alt="Edit"
                  width={30}
                  height={30}
                />
              </button>
            ) : null}
          </>
        )}
      </div>
      {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : null}
    </>
  );
};

type Level = RouterOutputs["property"]["getPropertyForUser"]["levels"][number];

type LevelProps = {
  level: Level;
  editPropertyMode: boolean;
};

const Level: React.FC<LevelProps> = ({ level, editPropertyMode }) => {
  const [editLabelMode, setEditLabelMode] = useState(false);
  const [editLabelInput, setEditLabelInput] = useState(level.label);

  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");

  const ctx = api.useContext();

  const { mutate: updateLevel } = api.property.updateLevelLabel.useMutation({
    onSuccess: () => {
      // toggle the textbox open
      setEditLabelMode(false);
      // refetch our property
      void ctx.property.getPropertyForUser.invalidate();
    },
  });

  const cancelEditLabelMode = () => {
    setEditLabelMode(false);
    setEditLabelInput(level.label);
    setError(false);
  };

  const updateLevelClickEvent = () => {
    // Check The Room input for correctness
    const checkEditLevelInput = ValidLevelInput.safeParse(editLabelInput);
    if (!checkEditLevelInput.success) {
      console.log("throw error onm input");
      const errorFormatted = checkEditLevelInput.error.format()._errors.pop();
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
    } else {
      console.log("add room ", editLabelInput);
      updateLevel({
        newLabel: editLabelInput,
        levelId: level.id,
      });
    }
  };

  return (
    <div className=" w-60 rounded-lg bg-black/20 text-center">
      <div className="mb-6 bg-black/10 py-4 text-center">
        <div className="flex">
          {editLabelMode ? (
            <ClickAwayListener clickOutsideAction={cancelEditLabelMode}>
              <div className="flex">
                <input
                  value={editLabelInput}
                  onChange={(e) => setEditLabelInput(e.target.value)}
                  disabled={false}
                  className={clsx(
                    "mx-2 w-full p-2 font-extrabold text-slate-900 outline-none",
                    { "border border-2 border-red-500": error }
                  )}
                />
                <button onClick={cancelEditLabelMode} className="px-1">
                  <Image src="/cancel.svg" alt="Edit" width={40} height={40} />
                </button>
                <button onClick={updateLevelClickEvent} className="px-1">
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
              <h2 className="w-full font-sans text-xl font-extrabold text-slate-900">
                {level.label}
              </h2>
              {editPropertyMode ? (
                <button onClick={() => setEditLabelMode(true)} className="pr-6">
                  <Image
                    src="/edit_button.svg"
                    alt="Edit"
                    width={30}
                    height={30}
                  />
                </button>
              ) : null}
            </>
          )}
        </div>
        {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-2 p-2">
        {level.rooms.map((room, index) => {
          return (
            <Room room={room} key={index} editPropertyMode={editPropertyMode} />
          );
        })}

        {editPropertyMode ? null : <AddRoomButton levelId={level.id} />}
      </div>
    </div>
  );
};

type AddLevelTextInputProps = {
  ToggleTextboxOpen: () => void;
  propertyId: string;
};

const ValidLevelInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

const AddLevelTextInput: React.FC<AddLevelTextInputProps> = ({
  ToggleTextboxOpen,
  propertyId,
}) => {
  const [levelNameInput, setLevelNameInput] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("Error");

  const ctx = api.useContext();

  const { mutate: createLevel, isLoading: createLevelLoading } =
    api.property.createLevelForProperty.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        ToggleTextboxOpen();
        // refetch our property
        void ctx.property.getPropertyForUser.invalidate();
      },
    });

  const AddLevelClickEvent = () => {
    // Check The Room input for correctness
    const checkLevelInput = ValidLevelInput.safeParse(levelNameInput);
    if (!checkLevelInput.success) {
      console.log("throw error onm input");
      const errorFormatted = checkLevelInput.error.format()._errors.pop();
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
    } else {
      console.log("add room ", levelNameInput);
      createLevel({
        label: levelNameInput,
        propertyId: propertyId,
      });
    }
  };

  return (
    <div
      className={clsx("h-24 w-60 rounded-lg bg-black/30 p-6 text-center", {
        "h-32": error,
      })}
    >
      <ClickAwayListener clickOutsideAction={ToggleTextboxOpen}>
        <div className={clsx("flex")}>
          <input
            disabled={createLevelLoading}
            onChange={(e) => setLevelNameInput(e.target.value)}
            className={clsx(
              "w-full p-2 font-extrabold text-slate-900 outline-none",
              { "border border-2 border-red-500": error }
            )}
          />
          <CTAButton onClick={AddLevelClickEvent}>+</CTAButton>
        </div>
      </ClickAwayListener>
      {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : null}
    </div>
  );
};

type AddLevelButtonProps = {
  propertyId: string;
};

const AddLevelButton: React.FC<AddLevelButtonProps> = ({ propertyId }) => {
  const [textboxOpen, setTextboxOpen] = useState(false);
  const ToggleTextboxOpen = () => {
    //toggle textboxOpen
    setTextboxOpen(!textboxOpen);
  };
  if (textboxOpen) {
    return (
      <AddLevelTextInput
        ToggleTextboxOpen={ToggleTextboxOpen}
        propertyId={propertyId}
      />
    );
  }
  return (
    <div className="h-24 w-60 rounded-lg bg-black/30 py-6 text-center ">
      <CTAButton onClick={ToggleTextboxOpen}>+ Add Level</CTAButton>
    </div>
  );
};

type EditPropertyModeButtonProps = {
  editPropertyMode: boolean;
  setEditPropertyMode: Dispatch<SetStateAction<boolean>>;
};

const EditPropertyModeButton: React.FC<EditPropertyModeButtonProps> = ({
  editPropertyMode,
  setEditPropertyMode,
}) => {
  return (
    <>
      {editPropertyMode ? (
        <div className="flex justify-center">
          <CTAButton
            onClick={() => setEditPropertyMode(false)}
            className="mb-8 flex"
          >
            Exit Edit Mode{" "}
            <Image src="/cancel.svg" alt="Edit" width={30} height={30} />
          </CTAButton>
        </div>
      ) : (
        <div className="flex justify-center">
          <CTAButton
            onClick={() => setEditPropertyMode(true)}
            className="mb-8 flex"
          >
            Edit Property{" "}
            <Image src="/edit_button.svg" alt="Edit" width={30} height={30} />
          </CTAButton>
        </div>
      )}
    </>
  );
};

type Property = RouterOutputs["property"]["getPropertyForUser"];

type EditPropertyProps = {
  property: Property;
};

const EditProperty: React.FC<EditPropertyProps> = ({ property }) => {
  const [editPropertyMode, setEditPropertyMode] = useState(false);
  // Edit Property button should not show if property has no levels,
  // instead a prompt to add levels and rooms to start building property
  const propertyHasNoLevels = property.levels.length === 0;

  return (
    <>
      {propertyHasNoLevels ? (
        <p className="px-12 pb-4 text-center text-lg text-slate-700">
          This Property currently has no levels or rooms, start by first adding
          a level below
        </p>
      ) : (
        <EditPropertyModeButton
          editPropertyMode={editPropertyMode}
          setEditPropertyMode={setEditPropertyMode}
        />
      )}
      <div className="flex flex-wrap justify-center gap-3">
        {property.levels.map((level, index) => {
          return (
            <Level
              level={level}
              key={index}
              editPropertyMode={editPropertyMode}
            />
          );
        })}
        {editPropertyMode ? null : <AddLevelButton propertyId={property.id} />}
      </div>
    </>
  );
};

export default EditProperty;
