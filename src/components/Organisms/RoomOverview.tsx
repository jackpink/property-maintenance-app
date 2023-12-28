import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import EditDatePopover from "../Molecules/EditDatePopover";
import { CTAButton } from "../Atoms/Button";
import { format } from "date-fns";
import { PageSubTitle } from "../Atoms/Title";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import {
  TabAttributeComponent,
  TabAttributeComponentLabel,
  TabAttributeComponentValue,
} from "../Atoms/TabLists";
import { TextInput } from "../Atoms/TextInput";

type RoomOverviewProps = {
  label: string;
  roomId: string;
  disabled?: boolean;
};

export default function RoomOverview({
  label,
  roomId,
  disabled = false,
}: RoomOverviewProps) {
  const [newLabel, setNewlabel] = useState(label);
  const ctx = api.useContext();

  const { mutate: updateRoom } = api.property.updateRoom.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.property.getRoom.invalidate();
      // close popover
    },
    onError: () => {
      toast("Failed to update Trade information for Job");
    },
  });

  return (
    <>
      <TabAttributeComponent
        title="Label"
        StandardComponent={<Label label={label} />}
        EditableComponent={
          <EditableLabel label={newLabel} setLabel={setNewlabel} />
        }
        exists={label ? true : false}
        onConfirmEdit={() => {
          updateRoom({ id: roomId, label: newLabel });
        }}
      />
    </>
  );
}

const Label: React.FC<{ label: string }> = ({ label }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Label:" />
      <TabAttributeComponentValue value={label} />
    </>
  );
};

const EditableLabel: React.FC<{
  label: string;
  setLabel: Dispatch<SetStateAction<string>>;
}> = ({ label, setLabel }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Label:" />
      <TextInput
        value={label}
        onChange={(e) => setLabel(e.currentTarget.value)}
        error={false}
      />
    </>
  );
};
