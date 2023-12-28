import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { ValidRoomInput } from "./AddRoom";
import TextInputWithEditButton from "~/components/Molecules/TextInputWithEditButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Room =
  RouterOutputs["property"]["getPropertyForUser"]["levels"][number]["rooms"][number];

type RoomLabelProps = {
  room: Room;
};

const RoomLabel: React.FC<RoomLabelProps> = ({ room }) => {
  const [editLabelMode, setEditLabelMode] = useState(false);
  const [editLabelInput, setEditLabelInput] = useState(room.label);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error");

  const ctx = api.useContext();

  const path = usePathname();

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
      <Link href={path + "/" + room.id}>
        <button className="w-full rounded-md border border-dark bg-black/10 p-1 text-xl font-medium hover:bg-black/20">
          {room.label}
        </button>
      </Link>
    </>
  );
};

export default RoomLabel;
