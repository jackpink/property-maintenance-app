import { RouterOutputs, api } from "~/utils/api";
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
import PropertyAttributes, {
  EditablePropertyAttributes,
} from "~/components/Molecules/PropertyAttributes";
import {
  TabAttributeComponent,
  TabListComponent,
} from "~/components/Atoms/TabLists";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Tab } from "@headlessui/react";

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

type PropertyAttributes = {
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  landSize?: number;
  floorSize?: number;
  height?: number;
  wallType?: string;
};

type HomeownerPropertyPageWithParamsProps = {
  propertyId: string;
};

const HomeownerPropertyPageWithParams: React.FC<
  HomeownerPropertyPageWithParamsProps
> = ({ propertyId }) => {
  const [propertyAttributes, setPropertyAttributes] =
    useState<PropertyAttributes>({});
  const path = useRouter().asPath;
  const {
    data: property,
    error: propertyFetchError,
    isLoading: propertyIsLoading,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });
  const ctx = api.useContext();
  const { mutate: updateProperty, isLoading: isUpdatingProperty } =
    api.property.updateProperty.useMutation({
      onSuccess: () => {
        // refetch our property
        void ctx.property.getPropertyForUser.invalidate();
      },
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
              <TabListComponent
                title="Overview"
                href={path.replace("/cover_image", "")}
                selected={false}
              />

              <TabListComponent
                title="Cover Image"
                href={path + "/cover_image"}
                selected={true}
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

const BackToDashboardButton: React.FC = () => {
  return (
    <Link href="/homeowner/">
      <CTAButton className="border-none"> {"< Back to Dashboard"}</CTAButton>
    </Link>
  );
};
