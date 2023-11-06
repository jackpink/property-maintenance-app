import { type NextPage } from "next";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  CTAButton,
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "~/components/Atoms/Button";
import { Text } from "~/components/Atoms/Text";

const Home: NextPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-teal-900 sm:text-[5rem]">
        Prop Doc
      </h1>
      <SignedIn>
        <div className="flex flex-wrap justify-center gap-4 text-center ">
          <Text>Welcome to Prop Doc the property maintenance app. </Text>
          <Text>Management all of the work done on your home.</Text>
          <Text>Search photos and documents for past work doe in rooms.</Text>
          <Link href="/homeowner">
            <LargeButton>
              <LargeButtonTitle>Homepage</LargeButtonTitle>
              <LargeButtonContent>
                Explore your properties and latest jobs
              </LargeButtonContent>
            </LargeButton>
          </Link>
        </div>
        {/* Mount the UserButton component */}
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <div className="flex justify-center">
          <Link className="block py-4" href="/trade/beta">
            <CTAButton className="rounded-full border-0 p-6">Sign In</CTAButton>
          </Link>
        </div>

        <div className="flex justify-center">
          <Link className="block" href="/create-account">
            <CTAButton className="rounded-full border-0 p-6">
              Create An Account
            </CTAButton>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default Home;
