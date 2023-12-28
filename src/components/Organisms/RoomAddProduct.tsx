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
import { usePathname } from "next/navigation";

type RoomAddProductProps = {
  roomId: string;
  createProductPopoverOpen: boolean;
  setCreateProductPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomAddProduct: React.FC<RoomAddProductProps> = ({
  roomId,
  createProductPopoverOpen,
  setCreateProductPopoverOpen,
}) => {
  return (
    <>
      <LargeButton onClick={() => setCreateProductPopoverOpen(true)}>
        <LargeButtonTitle>Add New Job</LargeButtonTitle>
        <LargeButtonContent>
          Create a new Job to be added to this property
        </LargeButtonContent>
      </LargeButton>
      <Popover
        popoveropen={createProductPopoverOpen}
        setPopoverOpen={setCreateProductPopoverOpen}
      >
        <CreateProductForm roomId={roomId} />
      </Popover>
    </>
  );
};

const ValidProductNameInput = z
  .string()
  .min(2, { message: "Must be 2 or more characters long" })
  .max(50, { message: "Must be less than 50 characters" });

type CreateProductFormProps = {
  roomId: string;
};

const CreateProductForm: React.FC<CreateProductFormProps> = ({ roomId }) => {
  const [productNameInput, setProductNameInput] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const path = usePathname();
  const router = useRouter();

  const { mutate: createProduct, isLoading: isCreatingProduct } =
    api.product.createProductForRoom.useMutation({
      onSuccess: ({ product }) => {
        // Redirect to new Job route
        console.log("redirect to product/", product.id);
        void router.push(path + "/" + product.id);
      },
    });

  const addProductClickEvent = () => {
    // Check The Room input for correctness
    const checkProductNameInput =
      ValidProductNameInput.safeParse(productNameInput);
    if (!checkProductNameInput.success) {
      const errorFormatted = checkProductNameInput.error.format()._errors.pop();
      console.log("throw error on input", errorFormatted);
      if (!!errorFormatted) setErrorMessage(errorFormatted);
      setError(true);
    } else {
      createProduct({
        label: productNameInput,
        roomId: roomId,
      });
    }
  };

  return (
    <div className="grid justify-items-center">
      <TextInputWithError
        label="Enter Job Title"
        value={productNameInput}
        onChange={(e) => setProductNameInput(e.target.value)}
        error={error}
        errorMessage={errorMessage}
        disabled={isCreatingProduct}
      />

      <CTAButton onClick={addProductClickEvent}>Create Product</CTAButton>
    </div>
  );
};

export default RoomAddProduct;
