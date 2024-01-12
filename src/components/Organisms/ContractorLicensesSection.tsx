import { RouterOutputs, api } from "~/utils/api";
import {
  TabListComponentAddDocument,
  TabListComponentAddField,
} from "../Molecules/EditableAttributes";
import { PageSubTitle } from "../Atoms/Title";
import { DocumentGroup } from "@prisma/client";
import { DocumentNotUploaded, DocumentUploaded } from "../Molecules/Document";

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

  const { mutate: addLicenseDocumentToContractor } =
    api.document.createDocumentRecord.useMutation({
      onSuccess: () => {
        void ctx.user.getContractor.invalidate();
      },
      onError: () => {},
    });

  console.log("contractor", contractor);

  return (
    <div>
      {contractor?.licenses?.map((section, index) => (
        <>
          <DisplayDocumentsForSection
            key={index}
            section={section}
            createDocument={(documentName: string) =>
              addLicenseDocumentToContractor({
                documentGroupId: section.id,
                label: documentName,
              })
            }
            contractorId={contractor?.id ?? ""}
          />
        </>
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
  createDocument,
  contractorId,
}: {
  section: Contractor["licenses"][0];
  createDocument: (documentName: string) => void;
  contractorId: string;
}) => {
  return (
    <div className="">
      <PageSubTitle>{section.label}</PageSubTitle>
      {section.documents.map((document, index) => (
        <>
          {document.filename ? (
            <DocumentUploaded document={document} />
          ) : (
            <DocumentNotUploaded
              documentId={document.id}
              userId={contractorId}
              label={document.label}
            />
          )}
        </>
      ))}
      <div className="pb-16 pl-10">
        <TabListComponentAddDocument
          onClick={(documentName: string) => {
            createDocument(documentName);
          }}
        />
      </div>
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
