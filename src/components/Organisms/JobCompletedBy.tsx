import { Prisma } from "@prisma/client";
import { useState } from "react";
import AddTradePopover, {
  instanceOfTradeInfo,
} from "../Molecules/AddTradePopover";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { TextSpan } from "../Atoms/Text";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";
import { TabAttributeComponent } from "../Atoms/TabLists";
import { on } from "events";

type JobCompletedByProps = {
  tradeInfo: Prisma.JsonValue | null;
  jobId: string;
  disabled?: boolean;
};

export default function JobCompletedBy({
  tradeInfo,
  jobId,
  disabled = false,
}: JobCompletedByProps) {
  const [editTradeInfoOpen, setEditTradeInfoOpen] = useState(false);

  const [form, setForm] = useState(
    !!tradeInfo &&
      instanceOfTradeInfo(tradeInfo) &&
      tradeInfo.name &&
      tradeInfo.email &&
      tradeInfo.phone
      ? { name: tradeInfo.name, email: tradeInfo.email, phone: tradeInfo.phone }
      : { name: "", email: "", phone: "" }
  );

  const ctx = api.useContext();

  const { mutate: updateTradeInfo } =
    api.job.updateTradeContactForJob.useMutation({
      onSuccess: () => {
        // Refetch job for page
        void ctx.job.getJob.invalidate();
        // close popover
        setEditTradeInfoOpen(false);
      },
      onError: () => {
        toast("Failed to update Trade information for Job");
      },
    });

  const onClickUpdate = () => {
    // check inputs?
    updateTradeInfo({
      jobId: jobId,
      tradeName: form.name,
      tradeEmail: form.email,
      tradePhone: form.phone,
    });
  };
  // Does job have a Trade User?
  return (
    <>
      <TabAttributeComponent
        title="Contractor"
        StandardComponent={<ContractorInformation />}
        EditableComponent={
          <AddTradePopover
            form={form}
            setForm={setForm}
            open={editTradeInfoOpen}
            setOpen={setEditTradeInfoOpen}
            disabled={disabled}
            onClickUpdate={onClickUpdate}
          />
        }
        exists={!!tradeInfo}
        onConfirmEdit={() => onClickUpdate()}
      />
    </>
  );
}

const ContractorInformation: React.FC<{ tradeInfo?: ITradeInfo }> = ({
  tradeInfo,
}) => {
  return (
    <>
      <p className="text-2xl font-medium">Contractor</p>
      <div className="pl-6">
        <span className="text-xl font-medium">Name:</span>
        <span>{tradeInfo?.name ?? "Test"}</span>
      </div>
    </>
  );
};
