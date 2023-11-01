import clsx from "clsx";
import React, {
  type ChangeEvent,
  useState,
  useId,
  cloneElement,
  ReactNode,
  ReactElement,
} from "react";
import { api } from "~/utils/api";
import { uploadFileToSignedURL } from "~/utils/upload";
import { CTAButton, UploadButton } from "../Atoms/Button";
import { z } from "zod";
import TextInputWithError from "../TextInput";
import { PageSubTitle } from "../Atoms/Title";
import { Button } from "react-day-picker";

export type UploadFor = "JOB" | "PROPERTY";

interface UploadButtonProps {
  loading?: boolean;
  disabled?: boolean;
}

type UploadDocumentWrapperProps = {
  label: string;
  uploadFor: UploadFor;
  refetchDataForPage: () => void;
  propertyId: string;
  jobId?: string;
};

export const UploadDocumentWrapper: React.FC<
  React.PropsWithChildren<UploadDocumentWrapperProps>
> = ({ label, uploadFor, refetchDataForPage, propertyId, jobId, children }) => {
  const [uploading, setUploading] = useState(false);

  const inputId = useId();

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
      setUploading(false);
      // Loading logic for button belongs in here
    } catch (e) {
      console.error("Could not upload file");
      console.log(e);
      setUploading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // check label input

    let file = null;
    if (event.target.files) file = event.target.files[0];
    if (file) {
      setUploading(true);
      void uploadFile(file);
    }
  };
  let ButtonWithUploading = null;
  if (!!children) {
    ButtonWithUploading = cloneElement(children as ReactElement<any | string>, {
      loading: uploading,
    });
  }

  // Should have ids for input and label generated by useId Hook

  return (
    <>
      <label
        htmlFor={inputId}
        className="h-full cursor-pointer place-self-center"
      >
        {!!children &&
          cloneElement(children as ReactElement<any | string>, {
            loading: uploading,
          })}

        <input
          onChange={handleFileChange}
          type="file"
          accept="application/pdf"
          id={inputId}
          className="opacity-0"
          hidden
        />
      </label>
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
          <PageSubTitle subtitle="Add a label for the Document before uploading" />

          <TextInputWithError
            label="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            error={error}
            errorMessage={errorMessage}
            type="text"
          />
          <CTAButton onClick={onClickNext}>Next</CTAButton>
        </>
      ) : (
        <>
          <CTAButton
            className="mb-6 justify-self-start border-none"
            onClick={() => setCreateLabelPage(true)}
          >
            ← Back to edit Label
          </CTAButton>
          <p className="text-sm">Document Label: </p>
          <label className="pb-6 text-lg text-slate-700">{label}</label>
          <UploadDocumentWrapper
            label={label}
            uploadFor={uploadFor}
            refetchDataForPage={refetchDataForPage}
            jobId={jobId}
            propertyId={propertyId}
          >
            <UploadButton loading={true}>Upload Document</UploadButton>
          </UploadDocumentWrapper>
        </>
      )}
    </div>
  );
};
