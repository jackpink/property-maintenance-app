import clsx from "clsx";
import React, {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
  use,
  useMemo,
  useRef,
} from "react";
import { useAuth, useOrganizationList, useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { CTAButton } from "~/components/Atoms/Button";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { PageTitle } from "~/components/Atoms/Title";
import { create } from "domain";

type Form = {
  organisationName: string;
  organisationNameError: boolean;
  organisationNameErrorMessage: string;
};

type ContractorDetails = {
  id: string;
  companyName: string;
};

const initialForm: Form = {
  organisationName: "",
  organisationNameError: false,
  organisationNameErrorMessage: "",
};

const ValidNameInput = z
  .string()
  .min(1, { message: "Must be 5 or more characters long" })
  .max(30, { message: "Must be less than 30 characters" });

const ContractorCreateAccountPage = () => {
  const [form, setForm] = useState(initialForm);

  const contractorDetails = useRef<ContractorDetails>({
    id: "",
    companyName: "",
  });

  const { mutate: createContractor } = api.user.createContractor.useMutation({
    onSuccess: () => {
      // Move to homeowner page
      void router.push("/create-account/contractor/payment");
    },
    onError: () => {
      toast("Could Not Create Contractor User");
    },
  });

  const [pendingVerification, setPendingVerification] = useState(false);

  const { createOrganization, isLoaded, userMemberships } = useOrganizationList(
    {
      userMemberships: true,
    }
  );
  const router = useRouter();

  console.log("userMemberships", userMemberships?.data?.pop()?.organization.id);

  const checkOrganisationNameInput = () => {
    let errorMessage = "";
    const checkOrganisationNameInputResult = ValidNameInput.safeParse(
      form.organisationName
    );
    if (!checkOrganisationNameInputResult.success) {
      const organisationNameErrorFormatted =
        checkOrganisationNameInputResult.error.format()._errors.pop();
      if (!!organisationNameErrorFormatted) {
        errorMessage = organisationNameErrorFormatted;
      }
      return {
        organisationNameError: true,
        organisationNameErrorMessage: errorMessage,
      };
    } else {
      return {
        organisationNameError: false,
        organisationNameErrorMessage: errorMessage,
      };
    }
  };

  const SignUpWithClerk = async () => {
    try {
      if (!!isLoaded) {
        const { addMember, getMemberships, id, name } =
          await createOrganization({
            name: form.organisationName,
          });
        // send the email
        //await addMember({
        await userMemberships.revalidate();
        console.log("new org Id", id, name);
        contractorDetails.current.id = id;
        contractorDetails.current.companyName = name;
      }
    } catch {
      toast("Could not create Account");
    } finally {
      // setLoading(false);
      console.log("new org Id finally");
      createContractor({
        contractorId: contractorDetails.current.id,
        companyName: contractorDetails.current.companyName,
      });
    }
  };

  const onSubmit = useCallback(() => {
    // Check validity of form inputs
    const { organisationNameError, organisationNameErrorMessage } =
      checkOrganisationNameInput();

    setForm({
      ...form,
      organisationNameError: organisationNameError,
      organisationNameErrorMessage: organisationNameErrorMessage,
    });
    const totalFormSuccess = !organisationNameError;
    if (totalFormSuccess) {
      console.log("Form is good");
      // Send to Clerk
      if (!isLoaded) {
        return;
      }
      void SignUpWithClerk();
    }
  }, [form.organisationNameError, SignUpWithClerk, form, isLoaded]);

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
          <OrganisationNameInput form={form} setForm={setForm} />
          <CTAButton onClick={onSubmit}>Submit</CTAButton>{" "}
        </>
      )}
    </div>
  );
};

export default ContractorCreateAccountPage;

type InputProps = {
  form: Form;
  setForm: Dispatch<SetStateAction<Form>>;
};

const OrganisationNameInput: React.FC<InputProps> = ({ form, setForm }) => {
  return (
    <div>
      <label htmlFor="firstName">Company Name:</label>
      <input
        value={form.organisationName}
        type="text"
        name="firstName"
        id="firstName"
        inputMode="text"
        autoComplete="given-name"
        onChange={(e) => setForm({ ...form, organisationName: e.target.value })}
        className={clsx(
          "w-full p-2 font-extrabold text-slate-900 outline-none",
          {
            "border border-2 border-red-500": form.organisationNameError,
          }
        )}
      />
      {form.organisationNameError && (
        <p className="text-red-500">⚠️ {form.organisationNameErrorMessage}</p>
      )}
    </div>
  );
};
