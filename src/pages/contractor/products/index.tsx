import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
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
import { ContractorLicensesSection } from "~/components/Organisms/ContractorLicensesSection";
import { ContractorProducts } from "~/components/Organisms/ContractorProducts";
import ContractorAddProduct from "~/components/Organisms/ContractorProductAdd";

const ContractorProductPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  console.log(user);
  if (!userId || !user) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return (
    <ContractorProductPageWithUser
      contractorId={user.organizationMemberships[0]?.organization.id ?? ""}
      name={user.organizationMemberships[0]?.organization.name ?? ""}
      admin={user.organizationMemberships[0]?.role === "Admin"}
    />
  );
};

type ContractorProductPageWithUserProps = {
  contractorId: string;
  name: string;
  admin: boolean;
};

const ContractorProductPageWithUser: React.FC<
  ContractorProductPageWithUserProps
> = ({ contractorId, name, admin }) => {
  const [createProductOpen, setCreateProductOpen] = useState(false);

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
        <PageWithSingleColumn>
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
              <div className="w-full">
                <div className="mx-auto max-w-7xl">
                  <div className="mx-auto flex justify-center py-8">
                    <ContractorAddProduct
                      contractorId={contractorId}
                      createProductPopoverOpen={createProductOpen}
                      setCreateProductPopoverOpen={setCreateProductOpen}
                    />
                  </div>
                  <ContractorProducts products={contractor.products} />
                </div>
              </div>
            </>
          )}
        </PageWithSingleColumn>
      </PageWithMainMenu>
    </ContractorPageRedirect>
  );
};

export default ContractorProductPage;
