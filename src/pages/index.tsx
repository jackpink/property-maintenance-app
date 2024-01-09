import { type NextPage } from "next";
import Link from "next/link";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import {
  CTAButton,
  LargeButton,
  LargeButtonContent,
  LargeButtonTitle,
} from "~/components/Atoms/Button";
import { Text } from "~/components/Atoms/Text";
import Logo from "~/components/Atoms/Logo";

const Home: NextPage = () => {
  const homeownerUser = true; //check homeowner users in db for id match
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <Logo width="300px" height="300px" colour="#c470e7" />
      <SignedIn>
        <div className="flex flex-col items-center justify-center gap-4 text-center ">
          <Text>Welcome to Prop Doc the property maintenance app. </Text>
          <Text>Management all of the work done on your home.</Text>
          <Text>Search photos and documents for past work doe in rooms.</Text>
          <Link href="/homeowner" className="">
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
          <Link className="block py-4" href="/">
            <CTAButton rounded>Sign In</CTAButton>
          </Link>
        </div>

        <div className="flex justify-center">
          <Link className="block" href="/create-account">
            <CTAButton rounded>Create An Account</CTAButton>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default Home;
