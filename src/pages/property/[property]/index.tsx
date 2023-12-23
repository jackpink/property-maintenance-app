import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { concatAddress } from "~/components/Molecules/Properties/Property";
import { CTAButton, EditButton, GhostButton } from "~/components/Atoms/Button";
import Link from "next/link";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageSubTitle, PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text, TextSpan } from "~/components/Atoms/Text";

import { PropertyPageNav } from "~/components/Molecules/PageNav";
import { PropertiesBreadcrumbs } from "~/components/Molecules/Breadcrumbs";
import Image from "next/image";
import house from "~/images/demo-page/house-stock-image.png";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import PropertyAttributes from "~/components/Molecules/PropertyAttributes";
import {
  TabAttributeComponent,
  TabListComponent,
} from "~/components/Atoms/TabLists";

// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

export default function HomeownerPropertyPage() {
  const id = useRouter().query.property?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id) return <>loading</>;
  return <HomeownerPropertyPageWithParams propertyId={id} />;
}

type HomeownerPropertyPageWithParamsProps = {
  propertyId: string;
};

const HomeownerPropertyPageWithParams: React.FC<
  HomeownerPropertyPageWithParamsProps
> = ({ propertyId }) => {
  const path = useRouter().asPath;
  const {
    data: property,
    error: propertyFetchError,
    isLoading: propertyIsLoading,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });

  if (!!propertyFetchError) toast("Failed to fetch property");
  let address = "";
  if (!!property) address = concatAddress(property);

  return (
    <PageWithMainMenu>
      <PropertiesBreadcrumbs address={address} propertyId={propertyId} />
      <PageTitle>{address}</PageTitle>
      <PropertyPageNav propertyId={propertyId} />
      <ResponsiveColumns>
        <ColumnOne>
          {propertyIsLoading ? (
            <div className="h-30 w-30">
              <LoadingSpinner />
            </div>
          ) : propertyFetchError ? (
            <div className="grid place-items-center">
              <Text>{propertyFetchError?.message}</Text>
              <BackToDashboardButton />
            </div>
          ) : (
            <>
              <Link href={path}>
                <p className="rounded-lg border bg-altSecondary pl-10 text-2xl text-altPrimary">
                  Overview
                </p>
              </Link>
              <TabListComponent title="Overview" href={path} selected={true} />
              <Link href={path + "/cover_image"}>
                <p className="rounded-lg border pl-10 text-2xl text-dark hover:bg-altSecondary">
                  Cover Image
                </p>
              </Link>
              <TabListComponent
                title="Cover Image"
                href={path + "/cover_image"}
                selected={false}
              />
            </>
          )}
        </ColumnOne>
        <ColumnTwo>
          {propertyIsLoading ? (
            <div className="h-30 w-30">
              <LoadingSpinner />
            </div>
          ) : propertyFetchError ? (
            <div className="grid place-items-center">
              <Text>{propertyFetchError?.message}</Text>
              <BackToDashboardButton />
            </div>
          ) : (
            <>
              <div className=" relative mx-auto flex flex-col items-center pt-10">
                <EditButton
                  height="40"
                  onClick={() => console.log("edit")}
                  className="absolute right-0"
                />
                <TabAttributeComponent
                  StandardComponent={<PropertyType />}
                  EditableComponent={<EditablePropertyType />}
                  exists={true}
                />

                <PropertyAttributes bathrooms={2} bedrooms={3} carSpaces={0} />
              </div>
              <div className="mx-auto flex flex-col items-center pt-10">
                <Image
                  alt="House Stock Image"
                  src={house}
                  className="min-w-xl rounded-xl p-3"
                />
                <GhostButton>Update Cover Image</GhostButton>
              </div>
            </>
          )}
        </ColumnTwo>
      </ResponsiveColumns>
    </PageWithMainMenu>
  );
};

const PropertyType: React.FC = () => (
  <Text className="py-10 text-xl font-medium tracking-wider">
    {"Property Type:" + "   " + "House"}
  </Text>
);

const EditablePropertyType: React.FC = () => (
  <TextSpan className="py-10 text-xl font-medium tracking-wider">
    {"Property Type:"}
  </TextSpan>
);

const BackToDashboardButton: React.FC = () => {
  return (
    <Link href="/homeowner/">
      <CTAButton className="border-none"> {"< Back to Dashboard"}</CTAButton>
    </Link>
  );
};
