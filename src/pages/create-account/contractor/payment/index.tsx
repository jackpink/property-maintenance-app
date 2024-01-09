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
import {
  useAuth,
  useOrganizationList,
  useSignUp,
  useUser,
} from "@clerk/nextjs";
import { z } from "zod";
import { CTAButton } from "~/components/Atoms/Button";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { PageTitle } from "~/components/Atoms/Title";
import { create } from "domain";
import Link from "next/link";

const ContractorAccountPaymentPage = () => {
  const router = useRouter();

  const { user, isLoaded } = useUser();

  const contractorId = user?.organizationMemberships[0]?.organization.id;

  console.log("contractor id", contractorId);

  return (
    <div>
      <>
        <PageTitle>Create Contractor Account</PageTitle>
        <div className=" flex w-full justify-around overflow-hidden  text-center">
          <div className="rounded-full border-2 border-black   p-2">
            <p className="font-bold">Step 1</p>
            <p>Create Admin User</p>
          </div>

          <div className="rounded-full border-2 border-black p-2">
            <p className="font-bold">Step 2</p>
            <p>Create Organisation</p>
          </div>
          <div className="rounded-full border-2 border-black bg-altSecondary p-2">
            <p className="font-bold">Step 3</p>
            <p>Add Payment Method</p>
          </div>
        </div>
        <h1>Please enter your payment details</h1>
        {isLoaded ? contractorId : "no id"}
        <Link href="/contractor">
          <CTAButton>Go to Dashboard</CTAButton>
        </Link>
      </>
    </div>
  );
};

export default ContractorAccountPaymentPage;
