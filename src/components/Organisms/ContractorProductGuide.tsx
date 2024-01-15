import { api } from "~/utils/api";
import {
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../Atoms/Button";
import router, { useRouter } from "next/router";

export const AddGuide = ({
  productId,
  contractorId,
}: {
  productId: string;
  contractorId: string;
}) => {
  // This can create a guide for the product then redirect to page
  const path = useRouter().asPath;

  const { mutateAsync: createGuide } =
    api.guide.createGuideForProduct.useMutation({
      onSuccess: (guide) => {
        // Redirect to new Guide route
        console.log("redirect to ", path, guide.id);
        void router.push(path + "/" + guide.id);
      },
    });

  return (
    <LargeButton
      onClick={() =>
        createGuide({ productId: productId, contractorId: contractorId })
      }
    >
      <LargeButtonTitle>Add New Guide</LargeButtonTitle>
      <LargeButtonContent>
        Create a new Guide to be added to this list
      </LargeButtonContent>
    </LargeButton>
  );
};
