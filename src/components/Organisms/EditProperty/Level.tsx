import { useState } from "react";
import TextInputWithEditButton from "~/components/Molecules/TextInputWithEditButton";
import { RouterOutputs, api } from "~/utils/api";
import { ValidLevelInput } from "./AddLevel";
import RoomLabel from "./RoomLabel";
import AddRoomButton from "./AddRoom";

type Level = RouterOutputs["property"]["getPropertyForUser"]["levels"][number];

type LevelProps = {
  level: Level;
};

const Level: React.FC<LevelProps> = ({ level }) => {
  const [editLabelMode, setEditLabelMode] = useState(false);
  const [editLabelInput, setEditLabelInput] = useState(level.label);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");

  const ctx = api.useContext();

  const { mutate: updateLevel, isLoading: isUpdatingLevel } =
    api.property.updateLevelLabel.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        setEditLabelMode(false);
        // refetch our property
        void ctx.property.getPropertyForUser.invalidate();
      },
    });

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
    <div className=" w-60 overflow-hidden rounded-lg bg-secondary text-center">
      <div className="mb-6 bg-primary py-4 text-center">
        <TextInputWithEditButton
          label={level.label}
          editLabelInput={editLabelInput}
          setEditLabelInput={setEditLabelInput}
          editLabelMode={editLabelMode}
          setEditLabelMode={setEditLabelMode}
          textInputDisabled={isUpdatingLevel}
          error={error}
          errorMessage={errorMessage}
          updateLabelClickEvent={updateLevelClickEvent}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 p-2">
        {level.rooms.map((room, index) => {
          return <RoomLabel room={room} key={index} />;
        })}
        <AddRoomButton levelId={level.id} />
      </div>
    </div>
  );
};

export default Level;
