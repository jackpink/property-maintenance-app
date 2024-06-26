import { useState } from "react";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import { CTAButton } from "~/components/Atoms/Button";
import { ColumnOne } from "~/components/Atoms/PageLayout";
import { TextInput } from "~/components/Atoms/TextInput";
import { PageSubTitle } from "~/components/Atoms/Title";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { ErrorMessage } from "~/components/Atoms/Text";

interface Error {
  longMessage: string;
}

interface ErrorObject {
  errors: Error[];
}

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: emailInput,
        password: passwordInput,
      });

      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        void router.push("/homeowner");
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result);
      }
    } catch (err) {
      console.error("error", (err as ErrorObject).errors[0]?.longMessage);
      setError(true);
      const responseMessage = (err as ErrorObject).errors[0]?.longMessage || "";
      setErrorMessage(responseMessage);
    }
  };

  return (
    <>
      <ColumnOne>
        <BackgroundContainer>
          <BackgroundContainerHeader>
            <PageSubTitle>Sign In</PageSubTitle>
          </BackgroundContainerHeader>
          <div className="flex flex-wrap justify-center">
            <div className="px-20 pb-10 sm:px-32 md:px-44 lg:px-56">
              <TextInput
                label="Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.currentTarget.value)}
                error={false}
                type="email"
              />
              <TextInput
                label="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.currentTarget.value)}
                error={error}
                type="password"
              />
            </div>
            <CTAButton onClick={() => void handleSubmit()}>Sign In</CTAButton>
          </div>
          <div className="text-center">
            <ErrorMessage error={error} errorMessage={errorMessage} />
          </div>
        </BackgroundContainer>
      </ColumnOne>
    </>
  );
};
export default SignInPage;
