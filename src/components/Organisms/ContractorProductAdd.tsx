import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";
import { TextInputWithError } from "../Atoms/TextInput";
import { DayPicker } from "react-day-picker";
import { CTAButton } from "../Atoms/Button";
import { format } from "date-fns";
import Popover from "../Atoms/Popover";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../Atoms/Button";

type ContractorAddProductProps = {
  contractorId: string;
  createProductPopoverOpen: boolean;
  setCreateProductPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ContractorAddProduct: React.FC<ContractorAddProductProps> = ({
  contractorId,
  createProductPopoverOpen,
  setCreateProductPopoverOpen,
}) => {
  return (
    <>
      <LargeButton onClick={() => setCreateProductPopoverOpen(true)}>
        <LargeButtonTitle>Add New Product</LargeButtonTitle>
        <LargeButtonContent>
          Create a new Product to be added to this list
        </LargeButtonContent>
      </LargeButton>
      <Popover
        popoveropen={createProductPopoverOpen}
        setPopoverOpen={setCreateProductPopoverOpen}
      >
        <CreateProductForm contractorId={contractorId} />
      </Popover>
    </>
  );
};

const ValidTextInput = z
  .string()
  .min(2, { message: "Must be 2 or more characters long" })
  .max(50, { message: "Must be less than 50 characters" });

type CreateProductFormProps = {
  contractorId: string;
};

type Form = {
  manufacturer: string;
  model: string;
  label: string;
  manufacturerError: boolean;
  modelError: boolean;
  labelError: boolean;
  manufacturerErrorMessage: string;
  modelErrorMessage: string;
  labelErrorMessage: string;
};

const initialForm: Form = {
  manufacturer: "",
  model: "",
  label: "",
  manufacturerError: false,
  modelError: false,
  labelError: false,
  manufacturerErrorMessage: "",
  modelErrorMessage: "",
  labelErrorMessage: "",
};

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  contractorId,
}) => {
  const [input, setInput] = useState(initialForm);

  const router = useRouter();

  const { mutateAsync: createProduct, isLoading: isCreatingProduct } =
    api.product.createProduct.useMutation({
      onSuccess: (product) => {
        console.log("product created", product);
      },
    });

  const addProductClickEvent = () => {
    // Check The Room input for correctness
    const checkManufacturerInput = ValidTextInput.safeParse(input.manufacturer);
    const checkModelInput = ValidTextInput.safeParse(input.model);
    const checkLabelInput = ValidTextInput.safeParse(input.label);
    if (!checkManufacturerInput.success) {
      const errorFormatted = checkManufacturerInput.error
        .format()
        ._errors.pop();
      console.log("throw error on input", errorFormatted);
      if (!!errorFormatted)
        setInput({
          ...input,
          manufacturerErrorMessage: errorFormatted,
          manufacturerError: true,
        });
    } else if (!checkModelInput.success) {
      const errorFormatted = checkModelInput.error.format()._errors.pop();
      console.log("throw error on input", errorFormatted);
      if (!!errorFormatted)
        setInput({
          ...input,
          modelErrorMessage: errorFormatted,
          modelError: true,
        });
    } else if (!checkLabelInput.success) {
      const errorFormatted = checkLabelInput.error.format()._errors.pop();
      console.log("throw error on input", errorFormatted);
      if (!!errorFormatted)
        setInput({
          ...input,
          labelErrorMessage: errorFormatted,
          labelError: true,
        });
    } else {
      createProduct({
        manufacturer: input.manufacturer,
        model: input.model,
        label: input.label,
      });
    }
  };

  return (
    <div className="grid justify-items-center">
      <TextInputWithError
        label="Manufacturer"
        value={input.manufacturer}
        onChange={(e) => setInput({ ...input, manufacturer: e.target.value })}
        error={input.manufacturerError}
        errorMessage={input.manufacturerErrorMessage}
        disabled={isCreatingProduct}
      />
      <TextInputWithError
        label="Model"
        value={input.model}
        onChange={(e) => setInput({ ...input, model: e.target.value })}
        error={input.modelError}
        errorMessage={input.modelErrorMessage}
        disabled={isCreatingProduct}
      />
      <TextInputWithError
        label="Label"
        value={input.label}
        onChange={(e) => setInput({ ...input, label: e.target.value })}
        error={input.labelError}
        errorMessage={input.labelErrorMessage}
        disabled={isCreatingProduct}
      />

      <CTAButton onClick={addProductClickEvent}>Create Product</CTAButton>
    </div>
  );
};

export default ContractorAddProduct;
