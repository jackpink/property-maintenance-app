import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/nextjs";
import { api } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";
import router from "next/router";

export const HomeownerPageRedirect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // get Clerk user object
  const { userId } = useAuth();

  return (
    <>
      {!userId ? (
        <LoadingSpinner />
      ) : (
        <HomeownerPageCheckUser userId={userId}>
          {children}
        </HomeownerPageCheckUser>
      )}
    </>
  );
};

const HomeownerPageCheckUser: React.FC<
  React.PropsWithChildren<{ userId: string }>
> = ({ children, userId }) => {
  const { data: isHomeowner, isLoading } =
    api.user.checkHomeownerExists.useQuery({ user: userId });

  console.log("isHomeowner", isHomeowner);

  if (!isHomeowner) void router.push("/redirect");
  return <>{isLoading || !isHomeowner ? <LoadingSpinner /> : children}</>;
};

export const ContractorPageRedirect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // get Clerk user object
  const { user, isLoaded } = useUser();

  const contractorId = user?.organizationMemberships[0]?.organization.id;

  return (
    <>
      {!contractorId ? (
        <LoadingSpinner />
      ) : (
        <ContractorPageCheckUser contractorId={contractorId}>
          {children}
        </ContractorPageCheckUser>
      )}
    </>
  );
};

const ContractorPageCheckUser: React.FC<
  React.PropsWithChildren<{ contractorId: string }>
> = ({ children, contractorId }) => {
  const { data: isContractor, isLoading } =
    api.user.checkContractorExists.useQuery({ contractorId: contractorId });

  console.log("isContractor", isContractor);

  if (!isContractor) void router.push("/redirect");
  return <>{isLoading || !isContractor ? <LoadingSpinner /> : children}</>;
};

export const GenericUserPageRedirect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <RedirectToHomeownerPage>
        <RedirectToContractorPage> {children}</RedirectToContractorPage>
      </RedirectToHomeownerPage>
    </>
  );
};

const RedirectToHomeownerPage: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // get Clerk user object
  const { userId } = useAuth();

  return (
    <>
      {!userId ? (
        <LoadingSpinner />
      ) : (
        <RedirectPageCheckHomeowner userId={userId}>
          {children}
        </RedirectPageCheckHomeowner>
      )}
    </>
  );
};

const RedirectPageCheckHomeowner: React.FC<
  React.PropsWithChildren<{ userId: string }>
> = ({ children, userId }) => {
  const { data: isHomeowner, isLoading } =
    api.user.checkHomeownerExists.useQuery({ user: userId });

  console.log("isHomeowner", !!isHomeowner);

  if (isHomeowner) void router.push("/properties");
  console.log("isLoading", isLoading);
  return <>{isLoading || !!isHomeowner ? <LoadingSpinner /> : children}</>;
};

const RedirectToContractorPage: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // get Clerk user object

  const { user, isLoaded } = useUser();

  //console.log(user?.getOrganizationMemberships());

  const contractorId = user?.organizationMemberships[0]?.organization.id;
  console.log(contractorId);

  return (
    <>
      <RedirectPageCheckContractor contractorId={contractorId ?? ""}>
        {children}
      </RedirectPageCheckContractor>
    </>
  );
};

const RedirectPageCheckContractor: React.FC<
  React.PropsWithChildren<{ contractorId: string }>
> = ({ children, contractorId }) => {
  const { data: isContractor, isLoading } =
    api.user.checkContractorExists.useQuery({ contractorId: contractorId });
  console.log("contractorId", contractorId);
  console.log("isContractor", isContractor);

  if (isContractor) void router.push("/contractor");
  return <>{isLoading || isContractor ? <LoadingSpinner /> : children}</>;
};
