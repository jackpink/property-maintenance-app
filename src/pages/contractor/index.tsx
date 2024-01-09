import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
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

const HomeownerPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  console.log(user);
  if (!userId || !user) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return (
    <HomeownerPageWithUser
      userId={userId}
      name={user.organizationMemberships[0]?.organization.name ?? ""}
    />
  );
};

type HomeownerPageWithUserProps = {
  userId: string;
  name: string | null;
};

const HomeownerPageWithUser: React.FC<HomeownerPageWithUserProps> = ({
  userId,
  name,
}) => {
  return (
    <ContractorPageRedirect>
      <PageWithMainMenu isHomeowner={false}>
        <PageTitle>{}</PageTitle>
        <PropertiesBreadcrumbs />
        <ResponsiveColumns>
          <ColumnOne>
            <Text className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
              Welcome {name}, this is your Dashboard. Create or Select a
              specific property or browse recent jobs here.
            </Text>
            <HomeownerCreateProperty userId={userId} />
            <div className="p-2"></div>
            <DashboardProperties userId={userId} />
          </ColumnOne>
          <ColumnTwo></ColumnTwo>
        </ResponsiveColumns>
      </PageWithMainMenu>
    </ContractorPageRedirect>
  );
};

export default HomeownerPage;
