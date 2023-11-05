import { useState } from "react";
import { z } from "zod";
import { CTAButton } from "~/components/Atoms/Button";
import AddButtonWithTextInput from "~/components/Molecules/AddButtonWithTextInput";
import { api } from "~/utils/api";

const ValidLevelInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

type AddLevelButtonProps = {
  propertyId: string;
};

const AddLevelButton: React.FC<AddLevelButtonProps> = ({ propertyId }) => {
  const [textboxOpen, setTextboxOpen] = useState(false);
  const [levelNameInput, setLevelNameInput] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");

  const ctx = api.useContext();

  const { mutate: createLevel, isLoading: createLevelLoading } =
    api.property.createLevelForProperty.useMutation({
      onSuccess: () => {
        // toggle the textbox open
        setTextboxOpen(false);
        // refetch our property
        void ctx.property.getPropertyForUser.invalidate();
      },
    });

  const addLevelClickEvent = () => {
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
    <AddButtonWithTextInput
      addButtonClickEvent={addLevelClickEvent}
      input={levelNameInput}
      setInput={setLevelNameInput}
      error={error}
      errorMessage={errorMessage}
      textboxOpen={textboxOpen}
      setTextboxOpen={setTextboxOpen}
    >
      <div className="h-24 w-60 rounded-lg bg-black/30 py-6 text-center ">
        <CTAButton onClick={() => setTextboxOpen(true)}>+ Add Level</CTAButton>
      </div>
    </AddButtonWithTextInput>
  );
};

export default AddLevelButton;
