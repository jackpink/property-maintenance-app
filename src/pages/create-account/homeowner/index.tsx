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
  password: string;
  passwordError: boolean;
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
  password: "",
  passwordError: false,
};

const ValidNameInput = z
  .string()
  .min(5, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

const HomeownerCreateAccountpage = () => {
  const [form, setForm] = useState(initialForm);
  console.log(form);

  const checkFirstNameInput = useCallback(() => {
    const checkFirstNameInputResult = ValidNameInput.safeParse(form.firstName);
    if (!checkFirstNameInputResult.success) {
      console.log("throw error on firstname");
      const firstNameErrorFormatted = checkFirstNameInputResult.error
        .format()
        ._errors.pop();
      if (!!firstNameErrorFormatted) {
      }
      console.log("form after first name errro", form);
      return true;
    } else {
      console.log("Remove first name error");

      return false;
    }
  }, [form]);

  const checkLastNameInput = useCallback(() => {
    const checkLastNameInputResult = ValidNameInput.safeParse(form.lastName);
    if (!checkLastNameInputResult.success) {
      console.log("error on last name");
      const lastNameErrorFormatted = checkLastNameInputResult.error
        .format()
        ._errors.pop();
      if (!!lastNameErrorFormatted) {
        console.log("form before lastn name error", form);
      }
      return true;
    } else {
      return false;
    }
  }, [form.firstNameError]);

  const onSubmit = useCallback(() => {
    console.log("form for onSubmit", form);
    // Check validity of form inputs
    const firstNameError = checkFirstNameInput();
    const lastNameError = checkLastNameInput();
    console.log("firstNameError", firstNameError);
    setForm({
      ...form,
      firstNameError: firstNameError,
      lastNameError: lastNameError,
    });
    const totalFormSuccess = firstNameError && lastNameError;
    if (totalFormSuccess) {
      console.log("Form is good");
      // Send to Clerk
      // Send to Backend
    }
  }, [form.firstNameError, form.lastNameError]);

  return (
    <div>
      <h1>Please enter your details</h1>
      <FirstNameInput form={form} setForm={setForm} />
      <LastNameInput form={form} setForm={setForm} />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default HomeownerCreateAccountpage;

type FirstNameInputProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
};

const FirstNameInput: React.FC<FirstNameInputProps> = ({ form, setForm }) => {
  console.log(form.firstNameError);
  return (
    <div>
      <h2>First Name:</h2>
      <input
        value={form.firstName}
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

const LastNameInput: React.FC<FirstNameInputProps> = ({ form, setForm }) => {
  return (
    <div>
      <h2>Last Name:</h2>
      <input
        value={form.lastName}
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
