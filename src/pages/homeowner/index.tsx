import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import React, { useCallback, useState } from "react";
import { CTAButton } from "~/components/Atoms/Button";
import Popover from "~/components/Atoms/Popover";
import Properties from "~/components/Properties";
import RecentJobs from "~/components/RecentJobs";
import { type RouterOutputs, api } from "~/utils/api";

const HomeownerPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  console.log(userId);
  if (!userId || !user) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return <HomeownerPageWithUser userId={userId} name={user.fullName} />;
};

type HomeownerPageWithUserProps = {
  userId: string;
  name: string | null;
};

const HomeownerPageWithUser: React.FC<HomeownerPageWithUserProps> = ({
  userId,
  name,
}) => {
  const properties = api.property.getPropertiesForHomeownerUser.useQuery({
    user: userId,
  });
  const jobs = api.job.getRecentJobsForHomeownerUser.useQuery({ user: userId });
  if (!!jobs.data && !!properties.data) {
    return (
      <div className="flex grid w-9/12 grid-cols-1  flex-col md:w-8/12 lg:w-7/12 xl:w-128">
        <h1 className="py-8 text-center font-sans text-4xl font-extrabold text-slate-900">
          Welcome {name}
        </h1>
        <h2 className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
          This is your Dashboard. Select a specific property or browse recent
          jobs here.
        </h2>
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Properties
        </h2>
        {properties.data.length > 0 ? (
          <Properties properties={properties.data} />
        ) : (
          <p className="text-center">You don&apos;t have any properties yet</p>
        )}
        <CreateProperty userId={userId} />
        <div className="mb-8 border-b-2 border-black pb-8"></div>
        <h2 className="pb-4 text-center font-sans text-3xl font-extrabold text-slate-900">
          Recents Jobs
        </h2>
        <RecentJobs recentJobs={jobs.data} />
      </div>
    );
  } else return <>loading</>;
};

type CreatePropertyProps = {
  userId: string;
};

const CreateProperty: React.FC<CreatePropertyProps> = ({ userId }) => {
  const [createPropertyPopover, setCreatePropertyPopover] = useState(false);

  return (
    <div className="grid justify-items-center">
      <CTAButton
        onClick={() => setCreatePropertyPopover(true)}
        className="mb-8 mt-6 place-self-center"
      >
        Create Property
      </CTAButton>
      <Popover
        popoveropen={createPropertyPopover}
        setPopoverOpen={setCreatePropertyPopover}
      >
        <CreatePropertyForm
          setCreatePropertyPopover={setCreatePropertyPopover}
        />
      </Popover>
    </div>
  );
};

type CreatePropertyFormProps = {
  setCreatePropertyPopover: Dispatch<SetStateAction<boolean>>;
};

type ValidAddress = RouterOutputs["property"]["addressValidation"];

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  setCreatePropertyPopover,
}) => {
  const [addressSearchTerm, setAddressSearchTerm] = useState("");
  const [validAddress, setValidAddress] = useState<ValidAddress>({
    apartment: null,
    streetNumber: "",
    street: "",
    suburb: "",
    postcode: "",
    state: "",
    country: "",
  });

  const ctx = api.useContext();

  const { mutate: getValidAddress, isLoading: isValidatingAddress } =
    api.property.addressValidation.useMutation({
      onSuccess: (AddressObj) => {
        // Redirect to new Job route
        console.log("got address string", AddressObj);
        setValidAddress(AddressObj);
      },
    });

  const { mutate: createProperty, isLoading: isCreatingProperty } =
    api.property.createPropertyForHomeownerUser.useMutation({
      onSuccess: () => {
        // refetch properties for page
        console.log("New Property Created for Homeowner");
        void ctx.property.getPropertiesForHomeownerUser.invalidate();
        setCreatePropertyPopover(false);
      },
    });

  const onClickSearch = useCallback(() => {
    console.log("search adddress");
    void getValidAddress({ addressSearchString: addressSearchTerm });
  }, [addressSearchTerm]);

  const onClickCreateProperty = () => {
    console.log("Create property y", validAddress);
    createProperty({
      apartment: validAddress.apartment,
      streetNumber: validAddress.streetNumber,
      street: validAddress.street,
      suburb: validAddress.suburb,
      postcode: validAddress.postcode,
      state: validAddress.state,
      country: validAddress.country,
    });
  };

  const addressString = concatAddress(validAddress);

  return (
    <div className="grid justify-items-center text-center">
      <h1 className="block pb-6 text-2xl font-medium text-gray-700">
        Create Property
      </h1>
      <AddressSearch
        setAddressSearchTerm={setAddressSearchTerm}
        onClickSearch={onClickSearch}
      />
      {addressString === " , , , " ? (
        <></>
      ) : (
        <>
          <p className="pb-2 text-lg font-bold">{addressString}</p>
          <p className="pb-4 text-sm font-normal text-slate-600">
            Is this the correct address? Please check carefully and if not
            search again
          </p>
          <PropertyPrompt
            addressObj={validAddress}
            onClickCreateProperty={onClickCreateProperty}
            isCreatingProperty={isCreatingProperty}
          />
        </>
      )}
      {/* seems a bit hacky*/}
    </div>
  );
};

import { type Dispatch, type SetStateAction } from "react";
import { concatAddress } from "~/components/Properties/Property";

type Props = {
  setAddressSearchTerm: Dispatch<SetStateAction<string>>;
  onClickSearch: () => void;
};

const AddressSearch: React.FC<Props> = ({
  setAddressSearchTerm,
  onClickSearch,
}) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setAddressSearchTerm(event.currentTarget.value);
  };

  return (
    <div className="w-full md:w-3/4 xl:w-1/2">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <input
          type="search"
          className="focus:border-primary dark:focus:border-primary relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-teal-700 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(13,148,136)] focus:outline-none dark:border-teal-600 dark:text-teal-200 dark:placeholder:text-neutral-200"
          placeholder="Search by suburb or postcode"
          onChange={handleChange}
        />

        <button
          className="relative z-[2] flex items-center rounded-r border border-solid border-teal-700 bg-teal-500 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg"
          type="button"
          id="button-addon1"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={onClickSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

type PropertyPromptProps = {
  addressObj: IAddress;
  onClickCreateProperty: () => void;
  isCreatingProperty: boolean;
};

const PropertyPrompt: React.FC<PropertyPromptProps> = ({
  addressObj,
  onClickCreateProperty,
  isCreatingProperty,
}) => {
  const { data, isLoading } = api.property.checkAddressStatus.useQuery({
    apartment: addressObj.apartment,
    streetNumber: addressObj.streetNumber,
    street: addressObj.street,
    suburb: addressObj.suburb,
    postcode: addressObj.postcode,
    state: addressObj.state,
    country: addressObj.country,
  });

  if (isLoading || isCreatingProperty) return <p>Loading</p>;

  // if query returned [property], then it will return an option to acquire this data
  return (
    <>
      {!!data && data.length === 0 ? (
        <CTAButton onClick={onClickCreateProperty}>Create Property</CTAButton>
      ) : (
        <p>
          This property already exists in our system. You will be unable to
          create it at this time.
        </p>
      )}
    </>
  );
};

export default HomeownerPage;
