import clsx from "clsx";
import { type ChangeEvent, useState } from "react";
import { api } from "~/utils/api";
import { uploadFileToSignedURL } from "~/utils/upload";
import Button from "./Button";
import { z } from "zod";

export type UploadFor = "JOB" | "PROPERTY";

type UploadDocumentButtonProps = {
  label: string;
  uploadFor: UploadFor;
  refetchDataForPage: () => void;
  propertyId: string;
  jobId?: string;
};

export const UploadDocumentButton: React.FC<
  React.PropsWithChildren<UploadDocumentButtonProps>
> = ({ label, uploadFor, refetchDataForPage, propertyId, jobId, children }) => {
  const { mutateAsync: getPresignedUrl } =
    api.document.getDocumentUploadPresignedUrl.useMutation();

  const { mutateAsync: createDocumentRecord } =
    api.document.createDocumentRecord.useMutation();

  const uploadFile = async (file: File) => {
    // Need to check that file is correct type (ie jpeg/png/tif/etc)
    try {
      console.log("Getting Presigned URL for file ", file.name);
      const { url, filename } = await getPresignedUrl({
        key: file.name,
        property: propertyId,
      });

      console.log("Uploading Document to Presigned URL ", file.name);
      const fileName = await uploadFileToSignedURL(url, file, filename);

      console.log(
        "Creating Document Record for DB ",
        file.name,
        fileName,
        uploadFor
      );
      let newDocument;
      if (uploadFor === "JOB" && jobId) {
        console.log("creating document record for JOB");
        newDocument = await createDocumentRecord({
          filename: fileName,
          label: label,
          jobId: jobId,
        });
      } else if (uploadFor === "PROPERTY") {
        console.log("creating document record for JOB");
        newDocument = await createDocumentRecord({
          filename: fileName,
          label: label,
          propertyId: propertyId,
        });
      } /* else if (uploadFor === "PRODUCT") {
        const newPhoto = await createDocumentRecord({
          filename: fileName,
          label: label,
          productId: productId 
        });*/

      console.log("Refetching Documents for Page", newDocument);
      newDocument && refetchDataForPage();
    } catch (e) {
      console.error("Could not upload file");
      console.log(e);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // check label input

    let file = null;
    if (event.target.files) file = event.target.files[0];
    if (file) {
      void uploadFile(file);
    }
  };

  return (
    <>
      <label
        htmlFor={label + "-document-upload-input"}
        className="cursor-pointer place-self-center "
      >
        {children}
      </label>
      <input
        onChange={handleFileChange}
        type="file"
        accept="application/pdf"
        id={label + "-document-upload-input"}
        className="opacity-0"
      />
    </>
  );
};

const ValidLabelInput = z
  .string()
  .min(1, { message: "Must be 1 or more characters long" })
  .max(50, { message: "Must be less than 50 characters" });

type UploadDocumentWithLabelInputProps = {
  uploadFor: "JOB" | "PROPERTY";
  refetchDataForPage: () => void;
  propertyId: string;
  jobId?: string;
};

export const UploadDocumentWithLabelInput: React.FC<
  UploadDocumentWithLabelInputProps
> = ({ uploadFor, refetchDataForPage, propertyId, jobId }) => {
  const [label, setLabel] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createLabelPage, setCreateLabelPage] = useState(true);

  const checkLabel = () => {
    console.log("checking label", label);
    const checkLabelInput = ValidLabelInput.safeParse(label);
    if (!checkLabelInput.success) {
      console.log("throw error onm input");
      const errorFormatted = checkLabelInput.error.format()._errors.pop();
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
      return false;
    } else {
      return true;
    }
  };

  const onClickNext = () => {
    // check label
    if (checkLabel()) setCreateLabelPage(false);
    // then update label page
  };
  return (
    <div className="grid place-items-center">
      {createLabelPage ? (
        <>
          <h1 className="pb-4 text-2xl text-slate-700">
            Add a label for the Document before uploading
          </h1>
          <label className="text-lg text-slate-700">Label </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={clsx("mb-4 rounded-md border-2 border-slate-400 p-1", {
              "border border-2 border-red-500": error,
            })}
          />
          {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : null}
          <Button onClick={onClickNext}>Next</Button>
        </>
      ) : (
        <>
          <Button
            className="mb-6 justify-self-start border-none"
            onClick={() => setCreateLabelPage(true)}
          >
            ← Back to edit Label
          </Button>
          <p className="text-sm">Document Label: </p>
          <label className="pb-6 text-lg text-slate-700">{label}</label>
          <UploadDocumentButton
            label={label}
            uploadFor={uploadFor}
            refetchDataForPage={refetchDataForPage}
            jobId={jobId}
            propertyId={propertyId}
          >
            <Button>Upload Document</Button>
          </UploadDocumentButton>
        </>
      )}
    </div>
  );
};
