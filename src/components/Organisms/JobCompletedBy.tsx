import { Prisma } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
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
import {
  TabAttributeComponent,
  TabAttributeComponentLabel,
  TabAttributeComponentValue,
} from "../Atoms/TabLists";
import { on } from "events";
import { TextInput } from "../Atoms/TextInput";

type JobCompletedByProps = {
  nonTradeUserName?: string;
  nonTradeUserEmail?: string;
  nonTradeUserPhone?: string;
  jobId: string;
  disabled?: boolean;
};

export default function JobCompletedBy({
  nonTradeUserEmail,
  nonTradeUserName,
  nonTradeUserPhone,
  jobId,
  disabled = false,
}: JobCompletedByProps) {
  const [name, setName] = useState(nonTradeUserName ?? "");
  const [email, setEmail] = useState(nonTradeUserEmail ?? "");
  const [phone, setPhone] = useState(nonTradeUserPhone ?? "");

  const ctx = api.useContext();

  const { mutate: updateJob } = api.job.updateJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.job.getJob.invalidate();
      // close popover
    },
    onError: () => {
      toast("Failed to update Trade information for Job");
    },
  });

  // Does job have a Trade User?
  return (
    <>
      {!nonTradeUserName ? (
        <TabAttributeComponent
          title="Contractor"
          StandardComponent={<ContractorName name={nonTradeUserName ?? ""} />}
          EditableComponent={
            <EditableContractorName name={name} setName={setName} />
          }
          exists={nonTradeUserName ? true : false}
          onConfirmEdit={() =>
            updateJob({ jobId: jobId, nonTradeUserName: name })
          }
        />
      ) : (
        <>
          <p className="pl-6 text-xl font-medium">Contractor</p>
          <div className="w-full pl-7">
            <TabAttributeComponent
              title="Contractor"
              StandardComponent={
                <ContractorName name={nonTradeUserName ?? ""} />
              }
              EditableComponent={
                <EditableContractorName name={name} setName={setName} />
              }
              exists={nonTradeUserName ? true : false}
              onConfirmEdit={() =>
                updateJob({ jobId: jobId, nonTradeUserName: name })
              }
            />
            <TabAttributeComponent
              title="Email"
              StandardComponent={
                <ContractorEmail email={nonTradeUserEmail ?? ""} />
              }
              EditableComponent={
                <EditableContractorEmail email={email} setEmail={setEmail} />
              }
              exists={nonTradeUserEmail ? true : false}
              onConfirmEdit={() => {
                updateJob({ jobId: jobId, nonTradeUserEmail: email });
              }}
            />
            <TabAttributeComponent
              title="Phone"
              StandardComponent={
                <ContractorPhone phone={nonTradeUserPhone ?? ""} />
              }
              EditableComponent={
                <EditableContractorPhone phone={phone} setPhone={setPhone} />
              }
              exists={nonTradeUserPhone ? true : false}
              onConfirmEdit={() => {
                updateJob({ jobId: jobId, nonTradeUserPhone: phone });
              }}
            />
          </div>
        </>
      )}
    </>
  );
}

const ContractorName: React.FC<{
  name: string;
}> = ({ name }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Name:" />
      <TabAttributeComponentValue value={name ?? ""} />
    </>
  );
};

const EditableContractorName: React.FC<{
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}> = ({ name, setName }) => {
  return (
    <div className="w-54 flex flex-wrap">
      <div className="no-flex">
        <TabAttributeComponentLabel label="Contractor Name:" />
      </div>

      <div className="grow">
        <TextInput
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={false}
        />
      </div>
    </div>
  );
};

const ContractorEmail: React.FC<{ email: string }> = ({ email }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Email:" />
      <TabAttributeComponentValue value={email} />
    </>
  );
};

const EditableContractorEmail: React.FC<{
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}> = ({ email, setEmail }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Email:" />
      <TextInput
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={false}
      />
    </>
  );
};

const ContractorPhone: React.FC<{ phone: string }> = ({ phone }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Phone:" />
      <TabAttributeComponentValue value={phone} />
    </>
  );
};

const EditableContractorPhone: React.FC<{
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
}> = ({ phone, setPhone }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Phone:" />
      <TextInput
        value={phone}
        onChange={(e) => setPhone(e.currentTarget.value)}
        error={false}
      />
    </>
  );
};
