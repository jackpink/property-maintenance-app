import { Document } from "@prisma/client";
import { useState } from "react";
import Popover from "./Popover";
import { api } from "~/utils/api";

type DocumentsProps = {
  documents: Document[];
};

const DocumentViewer: React.FC<DocumentsProps> = ({ documents }) => {
  return (
    <div className="flex flex-wrap">
      {documents.map((document, index) => (
        <Document document={document} key={index} />
      ))}
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
    <div>
      <button className="m-2 p-2" onClick={() => setDocumentOpen(true)}>
        <svg width="60" viewBox="0 0 130 170">
          <g id="layer1" transform="translate(-246.43 -187.36)">
            <path
              id="rect7452"
              d="m246.43 187.36v170h130v-141.34l-28.625-28.656h-101.38zm97.5 5 27.5 27.531h-27.5v-27.531zm-72.5 61.188h80v7h-80v-7zm0 30.625h80v7h-80v-7zm0 30.656h80v7h-80v-7z"
            />
          </g>
        </svg>
        <p>{document.label}</p>
      </button>
      {!!pdfUrl && (
        <Popover popoveropen={documentOpen} setPopoverOpen={setDocumentOpen}>
          <div className="h-screen">
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>
                This browser does not support PDFs. Please download the PDF to
                view it: <a href={pdfUrl}>Download PDF</a>.
              </p>
            </object>
          </div>
        </Popover>
      )}
    </div>
  );
};
export default DocumentViewer;
