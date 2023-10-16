import axios from "axios";

export const uploadFileToSignedURL = async (
    signedUrl: string,
    file: File,
    filename: string
  ) => {
    const result = await axios
      .put(signedUrl, file.slice(), {
        headers: { "Content-Type": file.type },
      })
      .then((response) => {
        console.log(response);
        console.log("Successfully Uploaded ", file.name);
        return filename;
      })
      .catch((err: string) => {
        console.log(err);
        return err;
      });
    return result;
  };