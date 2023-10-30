import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import DocumentViewer from "../Molecules/DocumentViewer";
import { CTAButton } from "../Atoms/Button";
import Popover from "../Atoms/Popover";
import { UploadDocumentWithLabelInput } from "../Molecules/UploadDocument";
import LoadingSpinner from "../Atoms/LoadingSpinner";

type Job = RouterOutputs["job"]["getJobForHomeowner"];

type JobDocumentProps = {
  job: Job;
};

export default function JobDocuments({ job }: JobDocumentProps) {
  const [uploadDocumentPopover, setUploadDocumentPopover] = useState(false);

  const { data: documents, isLoading: loading } =
    api.document.getDocumentsForJob.useQuery({ jobId: job.id });

  const ctx = api.useContext();

  const defaultDocumentsForJob = ["Invoice"]; //If documents label matches, then remove
  if (!!documents) {
    for (const document of documents) {
      const index = defaultDocumentsForJob.indexOf(document.label);
      console.log("INDEX", index);
      if (index >= 0) defaultDocumentsForJob.splice(index, 1);
    }
  }
  console.log("defaul;t docs", defaultDocumentsForJob);

  const refetchDataForPage = () => {
    void ctx.document.getDocumentsForJob.invalidate();
    setUploadDocumentPopover(false);
  };

  return (
    <div className="grid place-items-center">
      {!!documents ? (
        <DocumentViewer
          documents={documents}
          uploadFor="JOB"
          propertyId={job.Property.id}
          jobId={job.id}
          refetchDataForPage={refetchDataForPage}
          defaultDocuments={defaultDocumentsForJob}
        />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <p>error</p>
      )}

      <CTAButton onClick={() => setUploadDocumentPopover(true)}>
        Upload Other Document
      </CTAButton>
      <Popover
        popoveropen={uploadDocumentPopover}
        setPopoverOpen={setUploadDocumentPopover}
      >
        <UploadDocumentWithLabelInput
          uploadFor="JOB"
          jobId={job.id}
          refetchDataForPage={refetchDataForPage}
          propertyId={job.Property.id}
        />
      </Popover>
    </div>
  );
}
