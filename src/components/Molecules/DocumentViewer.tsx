import { Document } from "@prisma/client";
import { useState } from "react";
import Popover from "../Atoms/Popover";
import { Text } from "../Atoms/Text";
import { api } from "~/utils/api";
import {
  CTAButton,
  DefaultDocumentButton,
  DocumentButton,
  DocumentIcon,
  GhostButton,
  PlusIcon,
} from "../Atoms/Button";
import { UploadDocumentWrapper, UploadFor } from "./UploadDocument";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import { type } from "os";
import {
  DownloadIcon,
  GreenTickIcon,
  UploadIcon,
  ViewIcon,
} from "../Atoms/Icons";

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
  documentGroupId?: number;
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
  return (
    <div className="grid w-full place-items-center gap-4 px-5">
      {jobId ? (
        <DocumentViewerForJob
          uploadFor={uploadFor}
          jobId={jobId}
          refetchDataForPage={refetchDataForPage}
        />
      ) : documentGroupId ? (
        <DocumentViewerForGroup
          uploadFor={uploadFor}
          propertyId={propertyId}
          documentGroupId={documentGroupId}
          refetchDataForPage={refetchDataForPage}
        />
      ) : (
        <DocumentViewerForProperty
          uploadFor={uploadFor}
          propertyId={propertyId}
          refetchDataForPage={refetchDataForPage}
        />
      )}
    </div>
  );
};
type DocumentViewerForJobProps = {
  uploadFor: UploadFor;
  jobId: string;
  refetchDataForPage: () => void;
};

const DocumentViewerForJob: React.FC<DocumentViewerForJobProps> = ({
  uploadFor,
  jobId,
  refetchDataForPage,
}) => {
  const {
    data: documents,
    isLoading: loading,
    error,
  } = api.document.getDocumentsForJobWithNoGroup.useQuery({
    jobId: jobId,
  });

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Text>There was an error loading the documents</Text>
      ) : documents ? (
        <>
          {documents.map((document, index) => (
            <Document document={document} key={index} />
          ))}
        </>
      ) : (
        <Text>There are no documents for this property</Text>
      )}
    </>
  );
};

type DocumentViewerForPropertyProps = {
  uploadFor: UploadFor;
  propertyId: string;
  refetchDataForPage: () => void;
};

const DocumentViewerForProperty: React.FC<DocumentViewerForPropertyProps> = ({
  uploadFor,
  propertyId,
  refetchDataForPage,
}) => {
  const {
    data: documents,
    isLoading: loading,
    error,
  } = api.document.getDocumentsForPropertyWithNoGroup.useQuery({
    propertyId: propertyId,
  });

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Text>There was an error loading the documents</Text>
      ) : documents ? (
        <>
          {documents.map((document, index) => (
            <Document document={document} key={index} />
          ))}
        </>
      ) : (
        <Text>There are no documents for this property</Text>
      )}
    </>
  );
};

type DocumentViewerForGroupProps = {
  uploadFor: UploadFor;
  propertyId: string;
  documentGroupId: number;
  jobId?: string;
  refetchDataForPage: () => void;
};

const DocumentViewerForGroup: React.FC<DocumentViewerForGroupProps> = ({
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
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Text>There was an error loading the documents</Text>
      ) : documents ? (
        <>
          {defaultDocuments.map((defaultDocumentLabel, index) => {
            const defaultDocumentIsUploaded = documents.find(
              (document) => document.label === defaultDocumentLabel
            );
            if (!defaultDocumentIsUploaded) {
              return (
                <AddDefaultDocumentButton
                  label={defaultDocumentLabel}
                  uploadFor={uploadFor}
                  propertyId={propertyId}
                  documentGroupId={documentGroupId}
                  jobId={jobId}
                  refetchDataForPage={refetchDataForPage}
                  key={index}
                />
              );
            } else {
              return (
                <Document document={defaultDocumentIsUploaded} key={index} />
              );
            }
          })}

          {documents.map((document, index) => {
            const documentIsDefault = defaultDocuments.find(
              (defaultDoc) => defaultDoc === document.label
            );
            if (!documentIsDefault) {
              return <Document document={document} key={index} />;
            }
          })}
        </>
      ) : (
        <Text>There are no documents for this property</Text>
      )}
    </>
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
    <div className="flex w-full flex-nowrap	items-center gap-1 sm:gap-4">
      <GreenTickIcon width={28} height={28} />
      <DocumentIcon width="40" height="40" />
      <div className="grow text-left">
        <p className="text-lg font-medium md:pl-10">{document.label}</p>
      </div>
      <div className="flex grow-0 gap-4 ">
        <GhostButton onClick={() => setDocumentOpen(true)}>
          <div className="flex">
            <ViewIcon />
            <p className="hidden pl-2 lg:block">VIEW</p>
          </div>
        </GhostButton>
        <a href={pdfUrl}>
          <GhostButton>
            <div className="flex">
              <DownloadIcon />
              <p className="hidden pl-2 lg:block">DOWNLOAD</p>
            </div>
          </GhostButton>
        </a>
      </div>
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
  documentGroupId: number;
  jobId?: string;
  refetchDataForPage: () => void;
};

const AddDefaultDocumentButton: React.FC<AddDefaultDocumentButtonProps> = ({
  label,
  uploadFor,
  propertyId,
  documentGroupId,
  refetchDataForPage,
  jobId,
}) => {
  console.log("add default", uploadFor, label);
  return (
    <div className="flex w-full flex-nowrap gap-1 sm:gap-4">
      <div className="w-7 grow-0"></div>
      <DocumentIcon width="40" height="40" />
      <div className="grow">
        <p className="text-lg font-medium md:pl-10">{label}</p>
      </div>
      <div className="flex grow-0 gap-4 ">
        <UploadDocumentWrapper
          label={label}
          uploadFor={uploadFor}
          propertyId={propertyId}
          documentGroupId={documentGroupId}
          jobId={jobId}
          refetchDataForPage={refetchDataForPage}
        >
          <div className="border-1 flex rounded-lg border border-dark p-2">
            <UploadIcon /> <p className="hidden pl-2 md:block">UPLOAD</p>
          </div>
        </UploadDocumentWrapper>
      </div>
    </div>
  );
};
export default DocumentViewer;
