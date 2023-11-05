import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import JobDate from "~/components/Organisms/JobDate";
import PhotosViewerWithRoomSelector from "~/components/Molecules/PhotosViewerWithRoomSelector";
import React, { useState } from "react";
import UploadPhotoButton from "~/components/Molecules/UploadPhoto";
import PropertyHeroWithSelectedRooms from "~/components/Molecules/PropertyHeroWithSelectedRooms";
import { PageTitle } from "~/components/Atoms/Title";
import JobCompletedBy from "~/components/Organisms/JobCompletedBy";
import JobRoomSelector from "~/components/Organisms/JobRoomSelector";
import JobDocuments from "~/components/Organisms/JobDocuments";
import JobNotes from "~/components/Organisms/JobNotes";
import JobPhotos from "~/components/Organisms/JobPhotos";
import JobProperty from "~/components/Organisms/JobProperty";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
import { auth, useAuth } from "@clerk/nextjs";
import {
  ColumnOne,
  ColumnTwo,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";

export default function HomeownerJobPage() {
  const id = useRouter().query.index?.toString();

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
  const job = api.job.getJob.useQuery({ jobId: id });
  const history = api.job.getHistoryForJob.useQuery({ jobId: id });

  console.log(history.data);

  const jobLoading = job.isFetching || job.isLoading;

  const historyLoading = history.isFetching || history.isLoading;

  const forbidden = job.failureReason?.message === "FORBIDDEN";

  // have some logic here, if has trade user, then display without any action buttons
  return (
    <>
      {forbidden ? (
        <p>Forbidden</p>
      ) : jobLoading ? (
        <LoadingSpinner />
      ) : !job.data ? (
        <>Could not get Data</>
      ) : (
        <HomeownerJobPageWithJob
          job={job.data}
          jobLoading={jobLoading}
          history={history.data}
          historyLoading={historyLoading}
        />
      )}
    </>
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
  const ctx = api.useContext();

  const { userId } = useAuth();

  const isHomeowner = job.Property.homeownerUserId === userId;

  //Need to know whether the user is a Trade or Homeowner

  const refetchPhotosAfterUpload = () => {
    void ctx.photo.getPhotosForJobAndRoom.invalidate();
    void ctx.photo.getUnassignedPhotosForJob.invalidate();
  };

  return (
    <>
      <PageTitle>{job.title}</PageTitle>
      <ResponsiveColumns>
        <ColumnOne>
          <JobDate date={job.date} jobId={job.id} disabled={!isHomeowner} />
          <JobCompletedBy
            tradeInfo={job.nonUserTradeInfo}
            jobId={job.id}
            disabled={!isHomeowner}
          />

          <JobProperty
            job={job}
            jobLoading={jobLoading}
            disabled={!isHomeowner}
          />
          <JobDocuments job={job} disabled={!isHomeowner} />
          <JobNotes
            notes={job.notes}
            tradeNotes={job.tradeNotes}
            jobId={job.id}
            history={history?.homeownerNotes}
            historyLoading={historyLoading}
            disabled={!isHomeowner}
          />
        </ColumnOne>
        <ColumnTwo>
          <JobPhotos job={job} />
        </ColumnTwo>
      </ResponsiveColumns>
    </>
  );
};
