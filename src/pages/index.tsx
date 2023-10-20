import { type NextPage } from "next";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Button from "~/components/Button";

const Home: NextPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-teal-900 sm:text-[5rem]">
        Prop Doc
      </h1>
      <SignedIn>
        <div className="grid grid-cols-1 gap-4 ">
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
            <Button className="rounded-full border-0 p-6">Sign In</Button>
          </Link>
        </div>

        <div className="flex justify-center">
          <Link className="block" href="/create-account">
            <Button className="rounded-full border-0 p-6">
              Create An Account
            </Button>
          </Link>
        </div>
      </SignedOut>
      <div className="grid grid-cols-1 gap-4 ">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/20 p-4 text-teal-800 hover:bg-black/30"
          href="/demo"
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
