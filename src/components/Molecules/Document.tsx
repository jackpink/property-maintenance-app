import { useState } from "react";
import { api } from "~/utils/api";
import {
  UploadDocumentWrapper,
  UploadDocumentWrapperForExisting,
  UploadFor,
} from "./UploadDocument";
import {
  DownloadIcon,
  GreenTickIcon,
  UploadIcon,
  ViewIcon,
} from "../Atoms/Icons";
import { DocumentIcon, GhostButton } from "../Atoms/Button";
import Popover from "../Atoms/Popover";
import { Text } from "../Atoms/Text";
import { Document } from "@prisma/client";

type DocumentProps = {
  document: Document;
};
export const DocumentUploaded: React.FC<DocumentProps> = ({ document }) => {
  const [documentOpen, setDocumentOpen] = useState(false);
  const { data: pdfUrl } = api.document.getDocument.useQuery({
    filename: document.filename ?? undefined,
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
  userId: string;
  documentId: string;

  //refetchDataForPage: () => void;
};

export const DocumentNotUploaded: React.FC<AddDefaultDocumentButtonProps> = ({
  label,
  userId,
  documentId,
  //refetchDataForPage,
}) => {
  return (
    <div className="flex w-full flex-nowrap gap-1 sm:gap-4">
      <div className="w-7 grow-0"></div>
      <DocumentIcon width="40" height="40" />
      <div className="grow">
        <p className="text-lg font-medium md:pl-10">{label}</p>
      </div>
      <div className="flex grow-0 gap-4 ">
        <UploadDocumentWrapperForExisting
          label={label}
          userId={userId}
          documentId={documentId}
          refetchDataForPage={() => console.log("refetch")}
        >
          <div className="border-1 flex rounded-lg border border-dark p-2">
            <UploadIcon /> <p className="hidden pl-2 md:block">UPLOAD</p>
          </div>
        </UploadDocumentWrapperForExisting>
      </div>
    </div>
  );
};
