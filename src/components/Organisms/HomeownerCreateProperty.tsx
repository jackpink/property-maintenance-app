type HomeownerCreatePropertyProps = {
  userId: string;
};

const HomeownerCreateProperty: React.FC<HomeownerCreatePropertyProps> = ({
  userId,
}) => {
  const [createPropertyPopover, setCreatePropertyPopover] = useState(false);

  return (
    <div className="grid justify-items-center">
      <LargeButton onClick={() => setCreatePropertyPopover(true)}>
        <LargeButtonTitle>Create Property</LargeButtonTitle>
        <LargeButtonContent>
          Add a new property for you to manage.
        </LargeButtonContent>
      </LargeButton>
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

import {
  useState,
  type Dispatch,
  type SetStateAction,
  useCallback,
} from "react";
import { concatAddress } from "~/components/Molecules/Properties/Property";
import DashboardProperties from "~/components/Organisms/DashboardProperties";
import {
  CTAButton,
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../Atoms/Button";
import Popover from "../Atoms/Popover";
import { RouterOutputs, api } from "~/utils/api";

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

export default HomeownerCreateProperty;
