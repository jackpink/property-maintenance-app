import clsx from "clsx";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { z } from "zod";
import Button from "~/components/Button";

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
  .min(5, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

const ValidEmailInput = z
  .string()
  .min(5, { message: "Please enter your email" })
  .email("Please enter a valid email");

const ValidPasswordInput = z
  .string()
  .min(8, "Password must be minimum 8 characters")
  .regex(
    new RegExp(`(?=.*[!@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$`),
    "Password must contain lowercase captial and number"
  );

const HomeownerCreateAccountpage = () => {
  const [form, setForm] = useState(initialForm);

  const checkFirstNameInput = useCallback(() => {
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
  }, [form]);

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
      console.log("paswword is okay");
      return { passwordError: false, passwordErrorMessage: errorMessage };
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
    const totalFormSuccess = firstNameError && lastNameError && emailError;
    if (totalFormSuccess) {
      console.log("Form is good");
      // Send to Clerk
      // Send to Backend
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
  ]);

  return (
    <div>
      <h1>Please enter your details</h1>
      <FirstNameInput form={form} setForm={setForm} />
      <LastNameInput form={form} setForm={setForm} />
      <EmailInput form={form} setForm={setForm} />
      <PasswordInput form={form} setForm={setForm} />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default HomeownerCreateAccountpage;

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
