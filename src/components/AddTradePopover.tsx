import { Prisma } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Popover from "./Popover";
import Button from "./Atoms/Button";
import TextInputWithError from "./TextInput";

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
};

const AddTradePopover: React.FC<AddTradePopoverProps> = ({
  tradeInfo,
  editPopoverOpen,
  setEditPopoverOpen,
  form,
  setForm,
  onClickUpdate,
}) => {
  // This will either come from a Trade user in the system or just be JSON values
  // added to component
  return (
    <>
      {!!tradeInfo && instanceOfTradeInfo(tradeInfo) ? (
        <button
          onClick={() => setEditPopoverOpen(true)}
          className="mb-4 rounded-md border-2 border-black p-1"
        >
          <p className="pb-4 text-center text-xl text-slate-700">
            {tradeInfo.name}
          </p>
          <p className="text-left text-slate-600">
            <span className="font-light">Email: </span>
            {tradeInfo.email}
          </p>

          <p className="text-left text-slate-600">
            <span className="font-light">Phone Number: {"   "}</span>
            {tradeInfo.phone}
          </p>
          <span></span>
        </button>
      ) : (
        <button
          onClick={() => setEditPopoverOpen(true)}
          className="mb-6 rounded-md border-2 border-black p-1 text-center text-lg text-slate-700"
        >
          Add Information for Trade
        </button>
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
          <Button onClick={onClickUpdate}>Update Job Trade Information</Button>
        </div>
      </Popover>
    </>
  );
};

export default AddTradePopover;
