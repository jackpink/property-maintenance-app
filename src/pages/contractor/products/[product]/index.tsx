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
import { ContractorProductPageNav } from "~/components/Molecules/PageNav";

const ContractorProductPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const productId = useRouter().query.product?.toString();
  console.log(user);
  if (!userId || !user || !productId) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return (
    <ContractorProductPageWithUser
      contractorId={user.organizationMemberships[0]?.organization.id ?? ""}
      name={user.organizationMemberships[0]?.organization.name ?? ""}
      admin={user.organizationMemberships[0]?.role === "Admin"}
      productId={productId}
    />
  );
};

type ContractorProductPageWithUserProps = {
  contractorId: string;
  name: string;
  admin: boolean;
  productId: string;
};

const ContractorProductPageWithUser: React.FC<
  ContractorProductPageWithUserProps
> = ({ contractorId, name, admin, productId }) => {
  const {
    data: product,
    isLoading: productIsLoading,
    error: productFetchError,
  } = api.product.getProduct.useQuery({ id: productId });
  const path = useRouter().asPath;
  return (
    <ContractorPageRedirect>
      <PageWithMainMenu isHomeowner={false}>
        <PageTitle>{name}</PageTitle>
        <ContractorProductPageNav />
        <ResponsiveColumns>
          <ColumnOne>
            {productIsLoading ? (
              <div className="h-30 w-30">
                <LoadingSpinner />
              </div>
            ) : productFetchError ? (
              <div className="grid place-items-center">
                <Text>{productFetchError?.message}</Text>
              </div>
            ) : (
              <>
                <TabListComponent title="Details" href={path} selected={true} />

                <TabListComponent
                  title="Documents"
                  href={path + "/licenses"}
                  selected={false}
                />

                <TabListComponent
                  title="Image"
                  href={path + "/image"}
                  selected={false}
                />
              </>
            )}
          </ColumnOne>
          <ColumnTwo>
            {productIsLoading ? (
              <div className="h-30 w-30">
                <LoadingSpinner />
              </div>
            ) : productFetchError ? (
              <div className="grid place-items-center">
                <Text>{productFetchError?.message}</Text>
              </div>
            ) : (
              <></>
            )}
          </ColumnTwo>
        </ResponsiveColumns>
      </PageWithMainMenu>
    </ContractorPageRedirect>
  );
};

export default ContractorProductPage;
