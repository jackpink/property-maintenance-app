import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import JobDate from "~/components/Organisms/JobTitleAndDate";
import React from "react";
import { PageSubTitle, PageTitle } from "~/components/Atoms/Title";
import JobCompletedBy from "~/components/Organisms/JobCompletedBy";
import JobDocuments from "~/components/Organisms/JobDocuments";
import JobNotes from "~/components/Organisms/JobNotes";
import JobPhotos from "~/components/Organisms/JobPhotos";
import JobProperty from "~/components/Organisms/JobProperty";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
import { useAuth } from "@clerk/nextjs";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { NoteHistory } from "~/components/Molecules/NotesHistory";
import Properties from "~/components/Molecules/Properties";
import {
  JobBreadcrumbs,
  PropertiesBreadcrumbs,
} from "~/components/Molecules/Breadcrumbs";
import { concatAddress } from "~/utils/utits";
import { JobPageNav } from "~/components/Molecules/PageNav";
import JobRoomSelector from "~/components/Organisms/JobRoomSelector";

export default function HomeownerJobPage() {
  const id = useRouter().query.job?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id) return <>loading</>;

  return <HomeownerJobPageWithParams id={id} />;
}

type HomeownerJobPageWithParamsProps = {
  id: string;
};

const HomeownerJobPageWithParams: React.FC<HomeownerJobPageWithParamsProps> = ({
  id,
}) => {
  const {
    data: job,
    isLoading: jobLoading,
    failureReason: jobFailureReason,
    error: jobError,
  } = api.job.getJob.useQuery({ jobId: id });
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = api.job.getHistoryForJob.useQuery({ jobId: id });

  const forbidden = jobFailureReason?.message === "FORBIDDEN";

  // have some logic here, if has trade user, then display without any action buttons
  return (
    <PageWithMainMenu>
      {forbidden ? (
        <p>Forbidden</p>
      ) : jobLoading ? (
        <LoadingSpinner />
      ) : !job ? (
        <>Could not get Data</>
      ) : (
        <HomeownerJobPageWithJob
          job={job}
          jobLoading={jobLoading}
          history={history}
          historyLoading={historyLoading}
        />
      )}
    </PageWithMainMenu>
  );
};

export type Job = RouterOutputs["job"]["getJob"];

type HomeownerJobPageWithJobProps = {
  job: Job;
  jobLoading: boolean;
  history: RouterOutputs["job"]["getHistoryForJob"] | undefined;
  historyLoading: boolean;
};

const HomeownerJobPageWithJob: React.FC<HomeownerJobPageWithJobProps> = ({
  job,
  jobLoading,
  history,
  historyLoading,
}) => {
  const { userId } = useAuth();

  const isHomeowner = job.Property.homeownerUserId === userId;

  const address = concatAddress(job.Property);

  //Need to know whether the user is a Trade or Homeowner

  return (
    <>
      <JobBreadcrumbs
        address={address}
        propertyId={job.Property.id}
        jobTitle={job.title}
        jobId={job.id}
      />
      <PageTitle>{job.title}</PageTitle>
      <JobPageNav propertyId={job.Property.id} jobId={job.id} />

      <PageSubTitle>Select Rooms for Job</PageSubTitle>
      <JobRoomSelector job={job} jobLoading={false} />
    </>
  );
};
