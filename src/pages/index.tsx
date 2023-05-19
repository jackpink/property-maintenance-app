import { type NextPage } from "next";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-teal-900 sm:text-[5rem]">
        Prop Doc
      </h1>
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
      <div className="grid grid-cols-1 gap-4 ">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/20 p-4 text-teal-800 hover:bg-black/30"
          href="https://create.t3.gg/en/usage/first-steps"
          target="_blank"
        >
          <h3 className="text-2xl font-bold">Demo →</h3>
          <div className="text-lg">
            See how it works. Explore a demo version of the app.
          </div>
        </Link>
        
      </div>
      <p className="text-2xl text-white">
        {hello.data ? hello.data.greeting : "Loading tRPC query..."}
      </p>
      
    </div>
  );
};

export default Home;
