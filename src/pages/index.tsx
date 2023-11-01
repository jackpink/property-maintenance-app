import { type NextPage } from "next";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CTAButton } from "~/components/Atoms/Button";

const Home: NextPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-teal-900 sm:text-[5rem]">
        Prop Doc
      </h1>
      <SignedIn>
        <div className="grid grid-cols-1 gap-4 ">
          <h1>Welcome {}</h1>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/20 p-4 text-teal-800 hover:bg-black/30"
            href="/homeowner"
          >
            <h3 className="text-2xl font-bold">Homepage→</h3>
            <div className="text-lg">View your Properties and latest Jobs</div>
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
      <div className="grid grid-cols-1 gap-4 ">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/20 p-4 text-teal-800 hover:bg-black/30"
          href="/"
        >
          <h3 className="text-2xl font-bold">Demo →</h3>
          <div className="text-lg">
            See how it works. Explore a demo version of the app.
          </div>
        </Link>
      </div>
      <p className="text-2xl text-white"></p>
    </div>
  );
};

export default Home;
