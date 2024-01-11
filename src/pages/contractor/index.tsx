import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
  PageWithSingleColumn,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageTitle } from "~/components/Atoms/Title";
import DashboardProperties from "~/components/Organisms/DashboardProperties";
import DashboardRecentJobs from "~/components/Organisms/DashboardRecentJobs";
import HomeownerCreateProperty from "~/components/Organisms/HomeownerCreateProperty";
import { Text } from "~/components/Atoms/Text";
import Link from "next/link";
import { PropertiesBreadcrumbs } from "~/components/Molecules/Breadcrumbs";
import {
  ContractorPageRedirect,
  HomeownerPageRedirect,
} from "~/components/Atoms/UserRedirects";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
import { TabListComponent } from "~/components/Atoms/TabLists";
import { useRouter } from "next/router";
import { ContractorAboutSection } from "~/components/Organisms/ContractorAboutSection";

const ContractorHomePage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  console.log(user);
  if (!userId || !user) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return (
    <HomeownerPageWithUser
      contractorId={user.organizationMemberships[0]?.organization.id ?? ""}
      name={user.organizationMemberships[0]?.organization.name ?? ""}
      admin={user.organizationMemberships[0]?.role === "Admin"}
    />
  );
};

type HomeownerPageWithUserProps = {
  contractorId: string;
  name: string;
  admin: boolean;
};

const HomeownerPageWithUser: React.FC<HomeownerPageWithUserProps> = ({
  contractorId,
  name,
  admin,
}) => {
  const {
    data: contractor,
    isLoading: contractorIsLoading,
    error: contractorFetchError,
  } = api.user.getContractor.useQuery({ contractorId });
  const path = useRouter().asPath;
  return (
    <ContractorPageRedirect>
      <PageWithMainMenu isHomeowner={false}>
        <PageTitle>{name}</PageTitle>
        <ResponsiveColumns>
          <ColumnOne>
            {contractorIsLoading ? (
              <div className="h-30 w-30">
                <LoadingSpinner />
              </div>
            ) : contractorFetchError ? (
              <div className="grid place-items-center">
                <Text>{contractorFetchError?.message}</Text>
              </div>
            ) : (
              <>
                <TabListComponent title="About" href={path} selected={true} />

                <TabListComponent
                  title="Licenses & Legal"
                  href={path + "/licenses"}
                  selected={false}
                />

                <TabListComponent
                  title="Logo"
                  href={path + "/logo"}
                  selected={false}
                />
              </>
            )}
          </ColumnOne>
          <ColumnTwo>
            {contractorIsLoading ? (
              <div className="h-30 w-30">
                <LoadingSpinner />
              </div>
            ) : contractorFetchError ? (
              <div className="grid place-items-center">
                <Text>{contractorFetchError?.message}</Text>
              </div>
            ) : (
              <>
                <ContractorAboutSection contractor={contractor} />
              </>
            )}
          </ColumnTwo>
        </ResponsiveColumns>
      </PageWithMainMenu>
    </ContractorPageRedirect>
  );
};

export default ContractorHomePage;
