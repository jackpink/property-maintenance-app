import { RouterOutputs, api } from "~/utils/api";
import { TabListComponentLargeTextField } from "../Molecules/EditableAttributes";

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
