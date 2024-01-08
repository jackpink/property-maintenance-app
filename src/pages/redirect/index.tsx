/*
check if user is a homeowner, if true redirect to /properties
check if user is linked to an organization, if true redirect to /contractor
else redirect to error page
*/

import Link from "next/link";
import { GenericUserPageRedirect } from "~/components/Atoms/UserRedirects";

const RedirectPage = () => {
  return (
    <GenericUserPageRedirect>
      <div>
        <h1>Error</h1>
        <p>
          Your account is enither showing as a homeowner account or is connected
          to a Contractor account. If you'd like to create a new contractor
          account for{" "}
          <Link href="/create-account/contractor/organisation">click here</Link>
          . Otherwise please contact support.
        </p>
      </div>
    </GenericUserPageRedirect>
  );
};

export default RedirectPage;
