import { RouterOutputs, api } from "~/utils/api";
import { TabListComponentAddField } from "../Molecules/EditableAttributes";
import { PageSubTitle } from "../Atoms/Title";
import { ContractorDocumentGroup } from "@prisma/client";

type Contractor = RouterOutputs["user"]["getContractor"];

export const ContractorLicensesSection = ({
  contractor,
  editable = true,
}: {
  contractor: Contractor;
  editable?: boolean;
}) => {
  if (editable)
    return <ContractorLicensesSectionEditable contractor={contractor} />;
  else return <ContractorLicensesSectionReadOnly contractor={contractor} />;
};

const ContractorLicensesSectionEditable = ({
  contractor,
}: {
  contractor: Contractor;
}) => {
  const ctx = api.useContext();

  const { mutate: addLicenseSectionToContractor } =
    api.user.addLicenseSectionToContractor.useMutation({
      onSuccess: () => {
        void ctx.user.getContractor.invalidate();
      },
      onError: () => {},
    });

  console.log("contractor", !!contractor?.aboutStatement);

  return (
    <div>
      {contractor?.licenses?.map((section, index) => (
        <DisplayDocumentsForSection key={index} section={section} />
      ))}

      <TabListComponentAddField
        label="Section"
        onClick={(sectionName: string) => {
          addLicenseSectionToContractor({
            contractorId: contractor?.id ?? "",
            sectionName: sectionName,
          });
        }}
      />
    </div>
  );
};

const DisplayDocumentsForSection = ({
  section,
}: {
  section: RouterOutputs["user"]["getContractor"]["licenses"][0];
}) => {
  return (
    <div>
      <PageSubTitle>{section.label}</PageSubTitle>
      {section.documents.map((document, index) => (
        <div key={index}>{document.label}</div>
      ))}
    </div>
  );
};

const ContractorLicensesSectionReadOnly = ({
  contractor,
}: {
  contractor: Contractor;
}) => {
  return <div></div>;
};
