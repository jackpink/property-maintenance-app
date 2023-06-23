import { type NextPage } from "next";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const user1 = 'user_2Pm5uzeGIo3zDL8D38lLYxtyRad';
  const otherUser = "user_2RaC5cXnpHxdTKDmbX2Tooj1dNT"
  const jobs = api.job.getRecentJobsForTradeUser.useQuery({ user: otherUser});
  console.log("jobs", jobs.data);
  const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: otherUser});
  console.log(propertiesWithJobs.data);

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
        
        <Link href="/trade/beta" >Sign In</Link>
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
      <p className="text-2xl text-white">
      </p>
      
    </div>
  );
};

export default Home;
