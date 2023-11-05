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

  const ctx = api.useContext();

  const defaultDocumentsForProperty = ["Building Plans", "Contract of Sale"]; //If documents label matches, then remove
  if (!!documents) {
    for (const document of documents) {
      const index = defaultDocumentsForProperty.indexOf(document.label);
      console.log("INDEX", index);
      if (index >= 0) defaultDocumentsForProperty.splice(index, 1);
    }
  }
  console.log("defaul;t docs", defaultDocumentsForProperty);

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
        {!!documents ? (
          <DocumentViewer
            documents={documents}
            uploadFor="PROPERTY"
            propertyId={propertyId}
            refetchDataForPage={refetchDataForPage}
            defaultDocuments={defaultDocumentsForProperty}
          />
        ) : loading ? (
          <LoadingSpinner />
        ) : (
          <p>error</p>
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
