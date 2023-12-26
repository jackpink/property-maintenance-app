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
import { Job } from "~/pages/job/[index]";

type JobDocumentProps = {
  job: Job;
  disabled?: boolean;
};

export default function JobDocuments({
  job,
  disabled = false,
}: JobDocumentProps) {
  const [uploadDocumentPopover, setUploadDocumentPopover] = useState(false);

  const {
    data: documentGroups,
    isLoading: loading,
    error,
  } = api.document.getDocumentGroupsForJob.useQuery();

  const ctx = api.useContext();

  const defaultDocumentsForJob = ["Invoice"]; //If documents label matches, then remove

  const refetchDataForPage = () => {
    void ctx.document.getDocumentsForJobWithNoGroup.invalidate();
    void ctx.document.getDocumentsForGroupForJob.invalidate();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error.message}</p>
      ) : !!documentGroups ? (
        documentGroups.map((documentGroup, index) => (
          <>
            <PageSubTitle>{documentGroup.label}</PageSubTitle>
            <DocumentViewer
              uploadFor="JOB"
              propertyId={job.Property.id}
              jobId={job.id}
              documentGroupId={documentGroup.id}
              refetchDataForPage={refetchDataForPage}
            />
          </>
        ))
      ) : (
        <p>No documents found</p>
      )}

      <PageSubTitle>Other</PageSubTitle>
      <DocumentViewer
        uploadFor="JOB"
        jobId={job.id}
        propertyId={job.Property.id}
        refetchDataForPage={refetchDataForPage}
      />

      <GhostButton className="" onClick={() => setUploadDocumentPopover(true)}>
        UPLOAD OTHER DOCUMENT
      </GhostButton>
      <Popover
        popoveropen={uploadDocumentPopover}
        setPopoverOpen={setUploadDocumentPopover}
      >
        <UploadDocumentWithLabelInput
          uploadFor="JOB"
          refetchDataForPage={refetchDataForPage}
          propertyId={job.Property.id}
          jobId={job.id}
        />
      </Popover>
    </>
  );
}
