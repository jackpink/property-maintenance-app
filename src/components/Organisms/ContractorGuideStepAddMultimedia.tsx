import { RouterOutputs, api } from "~/utils/api";
import { CTAButton, UploadButton } from "../Atoms/Button";
import { uploadFileToSignedURL } from "~/utils/upload";
import { ChangeEvent, useState } from "react";

export const AddMultimediaButton = ({ step }: { step: Step }) => {
  const onClickAddImage = () => {};

  return (
    <>
      <AddMultimediaImage step={step} />
      <CTAButton>Add Video</CTAButton>
    </>
  );
};
type Step = RouterOutputs["guide"]["getGuide"]["steps"][0];

const AddMultimediaImage = ({ step }: { step: Step }) => {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: getPresignedUrl } =
    api.guide.getPhotoUploadPresignedUrl.useMutation();

  const { mutateAsync: createStepMultimedia } =
    api.guide.createStepMultimedia.useMutation();

  const ctx = api.useContext();

  const uploadFile = async (file: File) => {
    const { url, filename } = await getPresignedUrl({
      key: file.name,
      guideId: step.guideId,
    });

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
