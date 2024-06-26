import clsx from "clsx";
import { useState, type ChangeEvent } from "react";
import { api } from "~/utils/api";
import { uploadFileToSignedURL } from "~/utils/upload";
import { UploadButton } from "../Atoms/Button";

type UserType = "HOMEOWNER" | "TRADE";

type UploadPhotoButtonProps = {
  jobId: string;
  propertyId: string;
  userType: UserType;
  multipleUploads: boolean;
  refetchPageData: () => void;
};

const UploadPhotoButton: React.FC<UploadPhotoButtonProps> = ({
  jobId,
  propertyId,
  userType,
  multipleUploads,
  refetchPageData,
}) => {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: getPresignedUrl } =
    api.photo.getPhotoUploadPresignedUrl.useMutation();

  const { mutateAsync: createPhotoRecordForHomeowner } =
    api.photo.createPhotoRecordForHomeowner.useMutation();

  const { mutateAsync: createPhotoRecordForTrade } =
    api.photo.createPhotoRecordForTrade.useMutation();

  const uploadFile = async (file: File) => {
    // Need to check that file is correct type (ie jpeg/png/tif/etc)
    setLoading(true);
    console.log("Getting Presigned URL for file ", file.name);
    const { url, filename } = await getPresignedUrl({
      key: file.name,
      property: propertyId,
    });

    console.log("Uploading Image to Presigned URL ", file.name, filename);
    const fileName = await uploadFileToSignedURL(url, file, filename);

    console.log("Creating Photo Record for DB ", file.name, fileName);
    let newPhoto = null;
    if (userType === "HOMEOWNER") {
      newPhoto = await createPhotoRecordForHomeowner({
        filename: fileName,
        jobId: jobId,
        fileSize: file.size,
      });
    }
    if (userType === "TRADE") {
      newPhoto = await createPhotoRecordForTrade({
        filename: fileName,
        jobId: jobId,
        fileSize: file.size,
      });
    }
    console.log("Refetching Photos for Page", newPhoto);
    newPhoto && refetchPageData();
    newPhoto && setLoading(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const promiseArray = [];
      for (const file of fileArray) {
        promiseArray.push(uploadFile(file));
      }
      void Promise.all(promiseArray);
    }
  };

  return (
    <label htmlFor="photo-upload-input" className="mb-4 place-self-center">
      <UploadButton loading={loading}>Upload Photo</UploadButton>
      <input
        onChange={handleFileChange}
        multiple={multipleUploads}
        type="file"
        accept="capture=camera,image/*"
        id="photo-upload-input"
        className="opacity-0"
        hidden
      />
    </label>
  );
};

export default UploadPhotoButton;
