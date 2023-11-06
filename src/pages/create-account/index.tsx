import Link from "next/link";
import {
  LargeButton,
  LargeButtonTitle,
  LargeButtonContent,
} from "../../components/Atoms/Button";

const CreateAcccountPage = () => {
  return (
    <div>
      <h1 className="px-6 py-8 text-center font-sans text-xl font-extrabold text-slate-900">
        Please select which type of account you would like to create
      </h1>
      <div className="flex w-full justify-center">
        <Link href="/create-account/homeowner">
          <LargeButton>
            <LargeButtonTitle>Homeowner</LargeButtonTitle>
            <LargeButtonContent>
              Free account for homeowners allows you to manage up to 5
              properties with unlimited storage
            </LargeButtonContent>
          </LargeButton>
        </Link>
      </div>
    </div>
  );
};

export default CreateAcccountPage;
