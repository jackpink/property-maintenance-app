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

  const {
    data: documentGroups,
    isLoading: loading,
    error: error,
  } = api.document.getDocumentGroupsForProperty.useQuery();

  const ctx = api.useContext();

  const defaultDocumentsForProperty = ["Building Plans", "Contract of Sale"];

  const defaultDocumentsForPropertyByGroup = {
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
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p>{error.message}</p>
        ) : !!documentGroups ? (
          documentGroups.map((documentGroup, index) => (
            <>
              <PageSubTitle>{documentGroup.label}</PageSubTitle>
              <DocumentViewer
                uploadFor="PROPERTY"
                propertyId={propertyId}
                documentGroupId={documentGroup.id}
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
