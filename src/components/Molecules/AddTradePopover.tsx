import { Prisma } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Popover from "../Atoms/Popover";
import { CTAButton, EditButton, GhostButton } from "../Atoms/Button";
import { TextInputWithError } from "../TextInput";
import { Text } from "../Atoms/Text";

export function instanceOfTradeInfo(object: any): object is ITradeInfo {
  return "name" in object && "email" in object && "phone" in object;
}

type Form = {
  name: string;
  email: string;
  phone: string;
};

type AddTradePopoverProps = {
  tradeInfo: Prisma.JsonValue | null;

  editPopoverOpen: boolean;
  setEditPopoverOpen: Dispatch<SetStateAction<boolean>>;
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
  onClickUpdate: () => void;
  disabled?: boolean;
};

const AddTradePopover: React.FC<AddTradePopoverProps> = ({
  tradeInfo,
  editPopoverOpen,
  setEditPopoverOpen,
  form,
  setForm,
  onClickUpdate,
  disabled = false,
}) => {
  // This will either come from a Trade user in the system or just be JSON values
  // added to component
  return (
    <>
      {!!tradeInfo && instanceOfTradeInfo(tradeInfo) ? (
        <div className="relative">
          <div>
            <Text className="pb-4 text-center text-xl text-slate-700">
              {tradeInfo.name}
            </Text>
            <Text className="text-left text-slate-600">
              <span className="font-light">Email: </span>
              {tradeInfo.email}
            </Text>

            <Text className="text-left text-slate-600">
              <span className="font-light">Phone Number: {"   "}</span>
              {tradeInfo.phone}
            </Text>
          </div>
          <EditButton
            className="absolute right-0 top-1/2"
            onClick={() => setEditPopoverOpen(true)}
            disabled={disabled}
          />
        </div>
      ) : (
        <GhostButton
          onClick={() => setEditPopoverOpen(true)}
          disabled={disabled}
        >
          Add Information for Trade
        </GhostButton>
      )}
      <Popover
        popoveropen={editPopoverOpen}
        setPopoverOpen={setEditPopoverOpen}
      >
        <div className="grid place-items-center">
          <h1 className="pb-4 text-2xl text-slate-700">
            Edit Details for Trade
          </h1>

          <TextInputWithError
            label="Company"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
            error={false}
            errorMessage=""
            type="text"
          />

          <TextInputWithError
            label="Email (Optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
            error={false}
            errorMessage=""
            type="email"
          />

          <TextInputWithError
            label="Phone Number (Optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })}
            error={false}
            errorMessage=""
            type="tel"
          />
          <CTAButton onClick={onClickUpdate}>
            Update Job Trade Information
          </CTAButton>
        </div>
      </Popover>
    </>
  );
};

export default AddTradePopover;
