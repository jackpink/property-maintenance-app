import { RouterOutputs, api } from "~/utils/api";
import { CTAButton, UploadButton } from "../Atoms/Button";
import { uploadFileToSignedURL, uploadMultipartFileToS3 } from "~/utils/upload";
import { ChangeEvent, useState } from "react";

export const AddMultimediaButton = ({ step }: { step: Step }) => {
  const onClickAddImage = () => {};

  return (
    <>
      <AddMultimediaImage step={step} />
      <AddMultimediaVideo step={step} />
    </>
  );
};
type Step = RouterOutputs["guide"]["getGuide"]["steps"][0];

const AddMultimediaImage = ({ step }: { step: Step }) => {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: getPresignedUrl } =
    api.guide.getUploadPresignedUrl.useMutation();

  const { mutateAsync: createStepMultimedia } =
    api.guide.createStepMultimedia.useMutation();

  const ctx = api.useContext();

  const uploadFile = async (file: File) => {
    const { url, filename } = await getPresignedUrl({
      key: file.name,
      guideId: step.guideId,
      multimediaType: "IMAGE",
    });

    console.log("Uploading File", file, url, filename);

    const fileName = await uploadFileToSignedURL(url, file, filename);

    const newMultimedia = await createStepMultimedia({
      filename: fileName,
      stepId: step.id,
      type: "IMAGE",
    });
    console.log("Refetching Photos for Page", newMultimedia);
    newMultimedia && void ctx.guide.getGuide.invalidate();
    newMultimedia && setLoading(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files && files[0];
    if (file) {
      const promiseArray = [];

      promiseArray.push(uploadFile(file));

      void Promise.all(promiseArray);
    }
  };

  return (
    <>
      <label htmlFor="photo-upload-input" className="mb-4 place-self-center">
        <UploadButton loading={loading}>Upload Photo</UploadButton>
        <input
          onChange={handleFileChange}
          multiple={false}
          type="file"
          accept="capture=camera,image/*"
          id="photo-upload-input"
          className="opacity-0"
          hidden
        />
      </label>
    </>
  );
};

const AddMultimediaVideo = ({ step }: { step: Step }) => {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: getPresignedUrl } =
    api.guide.getUploadPresignedUrl.useMutation();

  const { mutateAsync: createStepMultimedia } =
    api.guide.createStepMultimedia.useMutation();

  const ctx = api.useContext();

  const uploadFile = async (file: File) => {
    console.log("FILE", file);
    const { url, filename } = await getPresignedUrl({
      key: file.name,
      guideId: step.guideId,
      multimediaType: "VIDEO",
    });
    // const result = await uploadVideo({
    //   guideId: step.guideId,
    //   file: file,
    // });

    // const result = await uploadMultipartFileToS3(
    //   file,
    //   "property-maintenance-app-guide-videos",
    //   step.guideId
    // );
    console.log("Uploading File", file, url, filename);
    const fileName = await uploadFileToSignedURL(url, file, filename);

    const newMultimedia = await createStepMultimedia({
      filename: fileName,
      stepId: step.id,
      type: "VIDEO",
    });

    console.log("Refetching Photos for Page", newMultimedia);
    // newMultimedia && void ctx.guide.getGuide.invalidate();
    newMultimedia && setLoading(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const file = files && files[0];
    if (file) {
      const promiseArray = [];

      promiseArray.push(uploadFile(file));

      void Promise.all(promiseArray);
    }
  };

  return (
    <>
      <label htmlFor="video-upload-input" className="mb-4 place-self-center">
        <UploadButton loading={loading}>Upload Video</UploadButton>
        <input
          onChange={handleFileChange}
          multiple={false}
          type="file"
          accept="capture=camera,video/*"
          id="video-upload-input"
          className="opacity-0"
          hidden
        />
      </label>
    </>
  );
};
