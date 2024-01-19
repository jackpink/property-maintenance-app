import { RouterOutputs, api } from "~/utils/api";
import {
  DocumentIcon,
  GhostButton,
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "../Atoms/Button";
import router, { useRouter } from "next/router";
import { EditIconSmall, GreenTickIcon, ViewIcon } from "../Atoms/Icons";
import Link from "next/link";

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

type Guides = RouterOutputs["product"]["getProduct"]["guides"];

export const ProductGuides = ({ guides }: { guides: Guides }) => {
  return (
    <>
      {guides.map((guide) => (
        <Guide key={guide.id} guide={guide} />
      ))}
    </>
  );
};

const Guide = ({ guide }: { guide: Guides[0] }) => {
  const path = useRouter().asPath;
  return (
    <div className="flex w-full flex-nowrap	items-center gap-1 sm:gap-4">
      <GreenTickIcon width={28} height={28} />
      <DocumentIcon width="40" height="40" />
      <div className="grow text-left">
        <p className="text-lg font-medium md:pl-10">{guide.label}</p>
      </div>
      <div className="flex grow-0 gap-4 ">
        <GhostButton onClick={() => console.log()}>
          <div className="flex">
            <ViewIcon />
            <p className="hidden pl-2 lg:block">VIEW</p>
          </div>
        </GhostButton>
        <Link href={`${path}/${guide.id}`}>
          <GhostButton>
            <div className="flex">
              <EditIconSmall />
              <p className="hidden pl-2 lg:block">Edit</p>
            </div>
          </GhostButton>
        </Link>
      </div>
    </div>
  );
};
