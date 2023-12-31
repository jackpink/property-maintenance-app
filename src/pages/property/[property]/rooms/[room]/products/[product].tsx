import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { concatAddress } from "~/components/Molecules/Properties/Property";
import { CTAButton } from "~/components/Atoms/Button";
import Link from "next/link";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
  PageWithSingleColumn,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { PageSubTitle, PageTitle } from "~/components/Atoms/Title";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
// build the property page
import { Text } from "~/components/Atoms/Text";
import { PropertyPageNav, RoomPageNav } from "~/components/Molecules/PageNav";
import PropertyRecentJobs from "~/components/Organisms/PropertyRecentJobs";
import PropertyAddJob from "~/components/Organisms/PropertyAddJob";
import { useState } from "react";
import {
  PropertiesBreadcrumbs,
  RoomBreadcrumbs,
} from "~/components/Molecules/Breadcrumbs";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import RoomSelectorPopover from "~/components/Molecules/RoomSelector";
import { ro } from "date-fns/locale";
import JobsSearchTool from "~/components/Organisms/JobsSearchTool";
import RoomAddProduct from "~/components/Organisms/RoomAddProduct";
// get params, get Property by Id
// edit and add levels and rooms /home/jack/Documents/Projects/property-maintenance-app/src/styles/globals.css
// search photos
// add new job ----> new job upload photos, assgin to rooms

export default function RoomProductPage() {
  const productId = useRouter().query.product?.toString();
  const propertyId = useRouter().query.property?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!productId || !propertyId) return <>loading</>;
  return (
    <RoomProductPageWithParams productId={productId} propertyId={propertyId} />
  );
}

type RoomProductPageWithParamsProps = {
  productId: string;
  propertyId: string;
};

const RoomProductPageWithParams: React.FC<RoomProductPageWithParamsProps> = ({
  productId,
  propertyId,
}) => {
  const {
    data: product,
    error: productError,
    isLoading: productLoading,
  } = api.product.getProduct.useQuery({
    id: productId,
  });

  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = api.property.getPropertyForUser.useQuery({
    id: propertyId,
  });

  if (!!propertyError) toast("Failed to fetch property");

  if (!!productError) toast("Failed to fetch product");
  let address = "";
  if (!!property) address = concatAddress(property);

  return (
    <PageWithMainMenu>
      <RoomBreadcrumbs
        address={address}
        propertyId={propertyId}
        roomId={product?.Room.id ?? ""}
        roomLabel={product?.Room.label ?? ""}
      />
      <PageTitle>{product?.label}</PageTitle>

      <RoomPageNav propertyId={propertyId} roomId={product?.Room.id || ""} />

      <PageWithSingleColumn>
        <div className="mx-auto flex justify-center py-8"></div>
        <BackgroundContainer>
          {productLoading ? (
            <LoadingSpinner />
          ) : productError ? (
            <Text>{propertyError?.message}</Text>
          ) : property ? null : (
            <Text>Could not load property.</Text>
          )}
        </BackgroundContainer>
      </PageWithSingleColumn>
    </PageWithMainMenu>
  );
};
