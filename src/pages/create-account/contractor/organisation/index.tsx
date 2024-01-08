import clsx from "clsx";
import React, {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from "react";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { CTAButton } from "~/components/Atoms/Button";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { PageTitle } from "~/components/Atoms/Title";

type Form = {
  firstName: string;
  firstNameError: boolean;
  firstNameErrorMessage: string;
  lastName: string;
  lastNameError: boolean;
  lastNameErrorMessage: string;
  email: string;
  emailError: boolean;
  emailErrorMessage: string;
  password: string;
  passwordError: boolean;
  passwordErrorMessage: string;
};

const initialForm: Form = {
  firstName: "",
  firstNameError: false,
  firstNameErrorMessage: "",
  lastName: "",
  lastNameError: false,
  lastNameErrorMessage: "",
  email: "",
  emailError: false,
  emailErrorMessage: "",
  password: "",
  passwordError: false,
  passwordErrorMessage: "",
};

const ValidNameInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

const ValidEmailInput = z
  .string()
  .min(1, { message: "Please enter your email" })
  .email("Please enter a valid email");

const ValidPasswordInput = z
  .string()
  .min(8, "Password must be minimum 8 characters")
  .regex(
    new RegExp(`(?=.*[A-Z])(?=.*[a-z]).*$`),
    "Password must contain at least one lowercase, uppercase and number"
  );

const ContractorCreateAccountPage = () => {
  const [form, setForm] = useState(initialForm);
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [completeSignUpError, setCompleteSignUpError] = useState(false);
  const [comleteSignUpErrorMessage, setCompleteSignUpErrorMessage] =
    useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const checkFirstNameInput = () => {
    let errorMessage = "";
    const checkFirstNameInputResult = ValidNameInput.safeParse(form.firstName);
    if (!checkFirstNameInputResult.success) {
      const firstNameErrorFormatted = checkFirstNameInputResult.error
        .format()
        ._errors.pop();
      if (!!firstNameErrorFormatted) {
        errorMessage = firstNameErrorFormatted;
      }
      return { firstNameError: true, firstNameErrorMessage: errorMessage };
    } else {
      return { firstNameError: false, firstNameErrorMessage: errorMessage };
    }
  };

  const checkLastNameInput = () => {
    let errorMessage = "";
    const checkLastNameInputResult = ValidNameInput.safeParse(form.lastName);
    if (!checkLastNameInputResult.success) {
      const lastNameErrorFormatted = checkLastNameInputResult.error
        .format()
        ._errors.pop();
      if (!!lastNameErrorFormatted) {
        errorMessage = lastNameErrorFormatted;
      }
      return { lastNameError: true, lastNameErrorMessage: errorMessage };
    } else {
      return { lastNameError: false, lastNameErrorMessage: errorMessage };
    }
  };

  const checkEmailInput = () => {
    let errorMessage = "";
    const checkEmailInputResult = ValidEmailInput.safeParse(form.email);
    if (!checkEmailInputResult.success) {
      const emailErrorFormatted = checkEmailInputResult.error
        .format()
        ._errors.pop();
      if (!!emailErrorFormatted) {
        errorMessage = emailErrorFormatted;
      }
      return { emailError: true, emailErrorMessage: errorMessage };
    } else {
      return { emailError: false, emailErrorMessage: errorMessage };
    }
  };

  const checkPasswordInput = () => {
    let errorMessage = "";
    const checkPasswordInputResult = ValidPasswordInput.safeParse(
      form.password
    );
    if (!checkPasswordInputResult.success) {
      const passwordErrorFormatted = checkPasswordInputResult.error
        .format()
        ._errors.pop();
      if (!!passwordErrorFormatted) {
        errorMessage = passwordErrorFormatted;
      }
      return { passwordError: true, passwordErrorMessage: errorMessage };
    } else {
      return { passwordError: false, passwordErrorMessage: errorMessage };
    }
  };

  const SignUpWithClerk = async () => {
    try {
      if (!!isLoaded) {
        await signUp.create({
          firstName: form.firstName,
          lastName: form.lastName,
          emailAddress: form.email,
          password: form.password,
        });
        // send the email
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      }
    } catch {
      toast("Could not create Account");
    }
  };

  const onSubmit = useCallback(() => {
    // Check validity of form inputs
    const { firstNameError, firstNameErrorMessage } = checkFirstNameInput();
    const { lastNameError, lastNameErrorMessage } = checkLastNameInput();
    const { emailError, emailErrorMessage } = checkEmailInput();
    const { passwordError, passwordErrorMessage } = checkPasswordInput();

    setForm({
      ...form,
      firstNameError: firstNameError,
      firstNameErrorMessage: firstNameErrorMessage,
      lastNameError: lastNameError,
      lastNameErrorMessage: lastNameErrorMessage,
      emailError: emailError,
      emailErrorMessage: emailErrorMessage,
      passwordError: passwordError,
      passwordErrorMessage: passwordErrorMessage,
    });
    const totalFormSuccess =
      !firstNameError && !lastNameError && !emailError && !passwordError;
    if (totalFormSuccess) {
      console.log("Form is good");
      // Send to Clerk
      if (!isLoaded) {
        return;
      }
      void SignUpWithClerk();

      // change UI to pending verfication
      setPendingVerification(true);
    }
  }, [
    form.firstNameError,
    form.lastNameError,
    form.firstName,
    form.lastName,
    form.email,
    form.emailError,
    form.password,
    form.passwordError,
    SignUpWithClerk,
    checkEmailInput,
    checkFirstNameInput,
    checkLastNameInput,
    checkPasswordInput,
    form,
    isLoaded,
  ]);

  const Verify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        console.log("user id", completeSignUp.createdUserId);
        if (!!completeSignUp.createdUserId)
          void router.push("/create-account/contractor/organisation");
      }
    } catch (err) {
      setCompleteSignUpError(true);
      setCompleteSignUpErrorMessage("Could not complete");
      console.log(err);
    }
  };

  const onPressVerify = () => {
    void Verify();
  };

  return (
    <div>
      {!pendingVerification && (
        <>
          <PageTitle>Create Contractor Account</PageTitle>
          <div className=" flex w-full justify-around overflow-hidden  text-center">
            <div className="rounded-full border-2 border-black   p-2">
              <p className="font-bold">Step 1</p>
              <p>Create Admin User</p>
            </div>

            <div className="rounded-full border-2 border-black bg-altSecondary p-2">
              <p className="font-bold">Step 2</p>
              <p>Create Organisation</p>
            </div>
          </div>
          <h1>Please enter your details</h1>
          <FirstNameInput form={form} setForm={setForm} />
          <CTAButton onClick={onSubmit}>Submit</CTAButton>{" "}
        </>
      )}
      {pendingVerification && (
        <EmailVerificationInput
          code={code}
          setCode={setCode}
          onPressVerify={onPressVerify}
          error={completeSignUpError}
          errorMessage={comleteSignUpErrorMessage}
        />
      )}
    </div>
  );
};

export default ContractorCreateAccountPage;

type InputProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
};

const FirstNameInput: React.FC<InputProps> = ({ form, setForm }) => {
  return (
    <div>
      <label htmlFor="firstName">First Name:</label>
      <input
        value={form.firstName}
        type="text"
        name="firstName"
        id="firstName"
        inputMode="text"
        autoComplete="given-name"
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        className={clsx(
          "w-full p-2 font-extrabold text-slate-900 outline-none",
          {
            "border border-2 border-red-500": form.firstNameError,
          }
        )}
      />
      {form.firstNameError && (
        <p className="text-red-500">⚠️ {form.firstNameErrorMessage}</p>
      )}
    </div>
  );
};

const LastNameInput: React.FC<InputProps> = ({ form, setForm }) => {
  return (
    <div>
      <label htmlFor="lastName">Last Name:</label>
      <input
        value={form.lastName}
        type="text"
        name="lastName"
        id="lastName"
        inputMode="text"
        autoComplete="family-name"
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        className={clsx(
          "w-full p-2 font-extrabold text-slate-900 outline-none",
          {
            "border border-2 border-red-500": form.lastNameError,
          }
        )}
      />
      {form.lastNameError && (
        <p className="text-red-500">⚠️ {form.lastNameErrorMessage}</p>
      )}
    </div>
  );
};

const EmailInput: React.FC<InputProps> = ({ form, setForm }) => {
  return (
    <div>
      <label htmlFor="email">Email:</label>
      <input
        value={form.email}
        type="email"
        name="email"
        id="email"
        inputMode="email"
        autoComplete="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={clsx(
          "w-full p-2 font-extrabold text-slate-900 outline-none",
          {
            "border border-2 border-red-500": form.emailError,
          }
        )}
      />
      {form.emailError && (
        <p className="text-red-500">⚠️ {form.emailErrorMessage}</p>
      )}
    </div>
  );
};

const PasswordInput: React.FC<InputProps> = ({ form, setForm }) => {
  return (
    <div>
      <label htmlFor="password">Password:</label>
      <input
        value={form.password}
        type="password"
        name="password"
        id="password"
        inputMode="text"
        autoComplete="new-password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className={clsx(
          "w-full p-2 font-extrabold text-slate-900 outline-none",
          {
            "border border-2 border-red-500": form.passwordError,
          }
        )}
      />
      {form.passwordError && (
        <p className="text-red-500">⚠️ {form.passwordErrorMessage}</p>
      )}
    </div>
  );
};

type EmailVerificationInputProps = {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  onPressVerify: () => void;
  error: boolean;
  errorMessage: string;
};

const EmailVerificationInput: React.FC<EmailVerificationInputProps> = ({
  code,
  setCode,
  onPressVerify,
  error,
  errorMessage,
}) => {
  return (
    <div>
      <label htmlFor="code">Enter verication code sent to your email:</label>
      <input
        value={code}
        type="numeric"
        name="code"
        id="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        onChange={(e) => setCode(e.target.value)}
        className={clsx(
          "w-full p-2 font-extrabold text-slate-900 outline-none",
          {
            "border border-2 border-red-500": error,
          }
        )}
      />
      {error && <p className="text-red-500">⚠️ {errorMessage}</p>}
      <CTAButton onClick={onPressVerify}>Verify Email</CTAButton>
    </div>
  );
};
