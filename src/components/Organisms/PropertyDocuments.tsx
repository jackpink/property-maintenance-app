import { useState } from "react";
import { api } from "~/utils/api";
import DocumentViewer from "../Molecules/DocumentViewer";
import { GhostButton } from "../Atoms/Button";
import Popover from "../Atoms/Popover";
import { UploadDocumentWithLabelInput } from "../Molecules/UploadDocument";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";

type PropertyDocumentProps = {
  propertyId: string;
  disabled?: boolean;
};

export default function PropertyDocuments({
  propertyId,
  disabled = false,
}: PropertyDocumentProps) {
  const [uploadDocumentPopover, setUploadDocumentPopover] = useState(false);

  const { data: documents, isLoading: loading } =
    api.document.getDocumentsForProperty.useQuery({ propertyId: propertyId });

  const {
    data: sections,
    isLoading: sectionsLoading,
    error: sectionsError,
  } = api.document.getDocumentSectionsForProperty.useQuery();

  const ctx = api.useContext();

  const defaultDocumentsForProperty = ["Building Plans", "Contract of Sale"];

  const defaultDocumentsForPropertyBySection = {
    1: ["Occupancy Certifcate", "Certificate of Classification"],
    2: [
      "Architectural Plans",
      "Structural Plans",
      "Electrical Plans",
      "Mechanical Plans",
      "Plumbing Plans",
      "Sanitary Plans",
      "Fire Protection Plans",
      "Electrical Load Schedule",
      "Structural Analysis",
      "Structural Design",
    ],
    3: ["Inspection Report", "Structural Report"],
  };
  //If documents label matches, then remove
  /*if (!!documents) {
    for (const document of documents) {
      const index = defaultDocumentsForProperty.indexOf(document.label);
      console.log("INDEX", index);
      if (index >= 0) defaultDocumentsForProperty.splice(index, 1);
    }
  }
  console.log("defaul;t docs", defaultDocumentsForProperty);
  */

  const refetchDataForPage = () => {
    void ctx.document.getDocumentsForProperty.invalidate();
    setUploadDocumentPopover(false);
  };

  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Documents</PageSubTitle>
      </BackgroundContainerHeader>
      <div className="grid place-items-center">
        {loading || sectionsLoading ? (
          <LoadingSpinner />
        ) : sectionsError ? (
          <p>{sectionsError.message}</p>
        ) : !!sections && !!documents ? (
          sections.map((section, index) => (
            <>
              <PageSubTitle>{section.label}</PageSubTitle>
              <DocumentViewer
                documents={documents}
                uploadFor="PROPERTY"
                propertyId={propertyId}
                sectionId={section.id}
                refetchDataForPage={refetchDataForPage}
              />
            </>
          ))
        ) : (
          <p>No documents found</p>
        )}

        <GhostButton
          className=""
          onClick={() => setUploadDocumentPopover(true)}
        >
          UPLOAD OTHER DOCUMENT
        </GhostButton>
        <Popover
          popoveropen={uploadDocumentPopover}
          setPopoverOpen={setUploadDocumentPopover}
        >
          <UploadDocumentWithLabelInput
            uploadFor="PROPERTY"
            refetchDataForPage={refetchDataForPage}
            propertyId={propertyId}
          />
        </Popover>
      </div>
    </BackgroundContainer>
  );
}
