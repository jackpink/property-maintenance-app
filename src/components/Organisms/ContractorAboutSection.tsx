import { RouterOutputs, api } from "~/utils/api";
import {
  TabListComponentLargeTextField,
  TabListComponentTags,
  TabListComponentTextField,
} from "../Molecules/EditableAttributes";
import { TagEnum } from "@prisma/client";

type Contractor = RouterOutputs["user"]["getContractor"];

export const ContractorAboutSection = ({
  contractor,
  editable = true,
}: {
  contractor: Contractor;
  editable?: boolean;
}) => {
  if (editable)
    return <ContractorAboutSectionEditable contractor={contractor} />;
  else return <ContractorAboutSectionReadOnly contractor={contractor} />;
};

const ContractorAboutSectionEditable = ({
  contractor,
}: {
  contractor: Contractor;
}) => {
  const ctx = api.useContext();

  const { mutate: updateContractor } = api.user.updateContractor.useMutation({
    onSuccess: () => {
      void ctx.user.getContractor.invalidate();
    },
    onError: () => {},
  });

  console.log("contractor", !!contractor?.aboutStatement);

  return (
    <div>
      <TabListComponentLargeTextField
        label="Statement"
        value={contractor?.aboutStatement ?? ""}
        exists={!!contractor?.aboutStatement}
        updateValueFunction={(newValue: string) => {
          updateContractor({
            aboutStatement: newValue,
            contractorId: contractor?.id ?? "",
          });
        }}
      />
      <TabListComponentTags
        tag={contractor?.tag ?? TagEnum.OTHER}
        exists={!!contractor?.tag}
        updateTagFunction={(newTag?: TagEnum) => {
          updateContractor({
            tag: newTag,
            contractorId: contractor?.id ?? "",
          });
        }}
      />
      <TabListComponentTextField
        label="Website"
        value={contractor?.website ?? ""}
        exists={!!contractor?.website}
        updateValueFunction={(newValue: string) => {
          updateContractor({
            website: newValue,
            contractorId: contractor?.id ?? "",
          });
        }}
        capitalise={false}
      />
    </div>
  );
};

const ContractorAboutSectionReadOnly = ({
  contractor,
}: {
  contractor: Contractor;
}) => {
  return (
    <div>
      <TabListComponentLargeTextField
        label="Statement"
        value={contractor?.aboutStatement ?? ""}
        exists={contractor?.aboutStatement !== undefined}
        updateValueFunction={() => {}}
      />
    </div>
  );
};
