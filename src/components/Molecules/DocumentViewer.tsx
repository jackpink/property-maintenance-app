import { Document } from "@prisma/client";
import { useState } from "react";
import Popover from "../Atoms/Popover";
import { Text } from "../Atoms/Text";
import { api } from "~/utils/api";
import {
  CTAButton,
  DefaultDocumentButton,
  DocumentButton,
  GhostButton,
  PlusIcon,
} from "../Atoms/Button";
import { UploadDocumentWrapper, UploadFor } from "./UploadDocument";
import LoadingSpinner from "../Atoms/LoadingSpinner";

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

type DocumentsProps = {
  uploadFor: UploadFor;
  propertyId: string;
  documentGroupId: number;
  jobId?: string;
  refetchDataForPage: () => void;
};
// jobId should not be undefined if uploadFor is JOB

// Add a search bar eventually

const DocumentViewer: React.FC<DocumentsProps> = ({
  uploadFor,
  propertyId,
  documentGroupId,
  jobId,
  refetchDataForPage,
}) => {
  const {
    data: documents,
    isLoading: loading,
    error,
  } = api.document.getDocumentsForGroupForProperty.useQuery({
    documentGroupId: documentGroupId,
    propertyId: propertyId,
  });

  let defaultDocuments: string[] = [];

  if (
    documentGroupId &&
    documentGroupId in defaultDocumentsForPropertyBySection
  ) {
    switch (documentGroupId) {
      case 1:
        defaultDocuments = defaultDocumentsForPropertyBySection[1];
        break;
      case 2:
        defaultDocuments = defaultDocumentsForPropertyBySection[2];
        break;
      case 3:
        defaultDocuments = defaultDocumentsForPropertyBySection[3];
        break;
    }
  }

  return (
    <div className="relative mb-4  w-full overflow-x-auto py-4">
      <div className="mx-12 flex gap-4">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Text>There was an error loading the documents</Text>
        ) : documents ? (
          <>
            {defaultDocuments.map((defaultDocumentLabel, index) => (
              <AddDefaultDocumentButton
                label={defaultDocumentLabel}
                uploadFor={uploadFor}
                propertyId={propertyId}
                jobId={jobId}
                refetchDataForPage={refetchDataForPage}
                key={index}
              />
            ))}

            {documents.map((document, index) => (
              <Document document={document} key={index} />
            ))}
          </>
        ) : (
          <Text>There are no documents for this property</Text>
        )}
      </div>
    </div>
  );
};

type DocumentProps = {
  document: Document;
};
const Document: React.FC<DocumentProps> = ({ document }) => {
  const [documentOpen, setDocumentOpen] = useState(false);
  const { data: pdfUrl } = api.document.getDocument.useQuery({
    filename: document.filename,
  });
  console.log("docuemnt url", pdfUrl);
  return (
    <div className="mx-auto flex flex-none items-center ">
      <DocumentButton
        label={document.label}
        onClick={() => setDocumentOpen(true)}
      />
      {!!pdfUrl && (
        <Popover popoveropen={documentOpen} setPopoverOpen={setDocumentOpen}>
          <div className="h-screen">
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <Text>
                This browser does not support PDFs. Please download the PDF to
                view it: .
              </Text>
              <a href={pdfUrl}>
                <GhostButton>Download PDF</GhostButton>
              </a>
            </object>
          </div>
        </Popover>
      )}
    </div>
  );
};

type AddDefaultDocumentButtonProps = {
  label: string;
  uploadFor: UploadFor;
  propertyId: string;
  jobId?: string;
  refetchDataForPage: () => void;
};

const AddDefaultDocumentButton: React.FC<AddDefaultDocumentButtonProps> = ({
  label,
  uploadFor,
  propertyId,
  refetchDataForPage,
  jobId,
}) => {
  console.log("add default", uploadFor, label);
  return (
    <UploadDocumentWrapper
      label={label}
      uploadFor={uploadFor}
      propertyId={propertyId}
      jobId={jobId}
      refetchDataForPage={refetchDataForPage}
    >
      <DefaultDocumentButton label={label} />
    </UploadDocumentWrapper>
  );
};
export default DocumentViewer;
