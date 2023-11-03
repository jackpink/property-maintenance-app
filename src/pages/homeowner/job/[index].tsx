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
  const job = api.job.getJobForHomeowner.useQuery({ jobId: id });
  const history = api.job.getHistoryForJob.useQuery({ jobId: id });

  console.log(history.data);

  const jobLoading = job.isFetching || job.isLoading;

  const historyLoading = history.isFetching || history.isLoading;

  if (!job.data) return <>Loading</>;
  // have some logic here, if has trade user, then display without any action buttons
  return (
    <HomeownerJobPageWithJob
      job={job.data}
      jobLoading={jobLoading}
      history={history.data}
      historyLoading={historyLoading}
    />
  );
};

type Job = RouterOutputs["job"]["getJobForHomeowner"];

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

  const refetchPhotosAfterUpload = () => {
    void ctx.photo.getPhotosForJobAndRoom.invalidate();
    void ctx.photo.getUnassignedPhotosForJob.invalidate();
  };

  return (
    <>
      <PageTitle title={job.title} />
      <div className="grid grid-cols-2 gap-4 3xl:gap-8">
        <div className="col-span-2 mx-4 grid justify-center md:w-128 3xl:col-span-1">
          <JobDate date={job.date} jobId={job.id} />
          <JobCompletedBy tradeInfo={job.nonUserTradeInfo} jobId={job.id} />

          <JobProperty job={job} jobLoading={jobLoading} />
          <JobDocuments job={job} />
          <JobNotes
            notes={job.notes}
            tradeNotes={job.tradeNotes}
            jobId={job.id}
            history={history?.homeownerNotes}
            historyLoading={historyLoading}
          />
        </div>
        <div className="col-span-2 mx-4 md:w-128 3xl:col-span-1">
          <JobPhotos job={job} />
        </div>
      </div>
    </>
  );
};
