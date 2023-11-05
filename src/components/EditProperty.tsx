import { type RouterOutputs, api } from "~/utils/api";
import clsx from "clsx";
import { type Dispatch, type SetStateAction, useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { CTAButton, PlusIcon } from "./Atoms/Button";
import ClickAwayListener from "./ClickAwayListener";
import AddRoomButton from "./Organisms/EditProperty/AddRoom";
import AddLevelButton from "./Organisms/EditProperty/AddLevel";
import RoomLabel from "./Organisms/EditProperty/RoomLabel";

// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

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
            <RoomLabel
              room={room}
              key={index}
              editPropertyMode={editPropertyMode}
            />
          );
        })}

        {editPropertyMode ? null : <AddRoomButton levelId={level.id} />}
      </div>
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
