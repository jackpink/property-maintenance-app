import { Prisma } from "@prisma/client";
import { useState } from "react";
import AddTradePopover, {
  instanceOfTradeInfo,
} from "../Molecules/AddTradePopover";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { TextSpan } from "../Atoms/Text";

type JobCompletedByProps = {
  tradeInfo: Prisma.JsonValue | null;
  jobId: string;
};

export default function JobCompletedBy({
  tradeInfo,
  jobId,
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
        void ctx.job.getJobForHomeowner.invalidate();
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
    <div className="grid place-items-center">
      <TextSpan className="">Job Completed By: </TextSpan>
      <AddTradePopover
        tradeInfo={tradeInfo}
        editPopoverOpen={editTradeInfoOpen}
        setEditPopoverOpen={setEditTradeInfoOpen}
        form={form}
        setForm={setForm}
        onClickUpdate={onClickUpdate}
      />
    </div>
  );
}
