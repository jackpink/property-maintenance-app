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

type DocumentsProps = {
  documents: Document[];
  uploadFor: UploadFor;
  propertyId: string;
  jobId?: string;
  refetchDataForPage: () => void;
  defaultDocuments: string[];
};
// jobId should not be undefined if uploadFor is JOB

// Add a search bar eventually

const DocumentViewer: React.FC<DocumentsProps> = ({
  documents,
  uploadFor,
  propertyId,
  jobId,
  refetchDataForPage,
  defaultDocuments,
}) => {
  return (
    <div className="relative  w-full overflow-x-auto">
      <div className="mx-12 flex">
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
    <div className="mx-auto flex-none">
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
