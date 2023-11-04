import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
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
import { Job } from "~/pages/homeowner/job/[index]";

type JobDocumentProps = {
  job: Job;
  disabled?: boolean;
};

export default function JobDocuments({
  job,
  disabled = false,
}: JobDocumentProps) {
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
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Documents</PageSubTitle>
      </BackgroundContainerHeader>
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
            uploadFor="JOB"
            jobId={job.id}
            refetchDataForPage={refetchDataForPage}
            propertyId={job.Property.id}
          />
        </Popover>
      </div>
    </BackgroundContainer>
  );
}
