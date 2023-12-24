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
import { Dispatch, SetStateAction, useState } from "react";
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
              <TabListComponent title="Overview" href={path} selected={true} />

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
              <TabAttributeComponent
                title="Property Type"
                StandardComponent={<PropertyType property={property} />}
                EditableComponent={
                  <EditablePropertyType
                    setTypeValue={(type: string) =>
                      setPropertyAttributes({
                        ...propertyAttributes,
                        type: type,
                      })
                    }
                  />
                }
                onConfirmEdit={() => {
                  updateProperty({
                    id: propertyId,
                    type: propertyAttributes.type,
                  });
                }}
                exists={property?.type ? true : false}
              />
              <TabAttributeComponent
                title="Room Information"
                StandardComponent={<RoomInformtion property={property} />}
                EditableComponent={
                  <EditableRoomInformation
                    property={property}
                    values={propertyAttributes}
                    setValues={setPropertyAttributes}
                  />
                }
                onConfirmEdit={() => {
                  updateProperty({
                    id: propertyId,
                    roomInfo: {
                      bedrooms: propertyAttributes.bedrooms ?? 0,
                      bathrooms: propertyAttributes.bathrooms ?? 0,
                      carSpaces: propertyAttributes.carSpaces ?? 0,
                    },
                  });
                }}
                exists={
                  property?.bedrooms
                    ? true
                    : false && property?.bathrooms
                    ? true
                    : false && property?.carSpaces
                    ? true
                    : false
                }
              />

              <PropertyAttributes bathrooms={2} bedrooms={3} carSpaces={0} />

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

const PropertyType: React.FC<{
  property: RouterOutputs["property"]["getPropertyForUser"];
}> = ({ property }) => (
  <>
    <TextSpan className="pl-6 text-xl font-medium">Property Type:</TextSpan>
    <TextSpan className="pl-10 text-xl font-medium">
      {property.type?.charAt(0).toUpperCase() ?? ""}
    </TextSpan>
    <TextSpan className=" text-xl font-medium">
      {property.type?.slice(1) ?? ""}
    </TextSpan>
  </>
);

const EditablePropertyType: React.FC<{
  setTypeValue: (type: string) => void;
}> = ({ setTypeValue }) => {
  return (
    <>
      <TextSpan className="pl-7 text-xl font-medium">
        {"Property Type:"}
      </TextSpan>
      <select
        className="pl-6"
        onChange={(e) => setTypeValue(e.currentTarget.value)}
      >
        <option disabled selected value="">
          {" "}
          -- select an option --{" "}
        </option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="unit">Unit</option>
        <option value="townhouse">Townhouse</option>
        <option value="villa">Villa</option>
        <option value="duplex">Duplex</option>
      </select>
    </>
  );
};

const RoomInformtion: React.FC<{
  property: RouterOutputs["property"]["getPropertyForUser"];
}> = ({ property }) => {
  return (
    <PropertyAttributes
      bathrooms={property.bathrooms ?? 0}
      bedrooms={property.bedrooms ?? 0}
      carSpaces={property.carSpaces ?? 0}
    />
  );
};

const EditableRoomInformation: React.FC<{
  property: RouterOutputs["property"]["getPropertyForUser"];
  values: PropertyAttributes;
  setValues: Dispatch<SetStateAction<PropertyAttributes>>;
}> = ({ property, values, setValues }) => {
  return <EditablePropertyAttributes values={values} setValues={setValues} />;
};

const BackToDashboardButton: React.FC = () => {
  return (
    <Link href="/homeowner/">
      <CTAButton className="border-none"> {"< Back to Dashboard"}</CTAButton>
    </Link>
  );
};
