import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";
import router from "next/router";

export const HomeownerPageRedirect: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // get Clerk user object
  const { userId } = useAuth();

  return (
    <>
      {!userId ? (
        <LoadingSpinner />
      ) : (
        <HomeownerPageCheckUser userId={userId}>
          {children}
        </HomeownerPageCheckUser>
      )}
    </>
  );
};

const HomeownerPageCheckUser: React.FC<
  React.PropsWithChildren<{ userId: string }>
> = ({ children, userId }) => {
  const { data: isHomeowner, isLoading } =
    api.user.checkHomeownerExists.useQuery({ user: userId });

  console.log("isHomeowner", isHomeowner);

  if (!isHomeowner) void router.push("/redirect");
  return <>{isLoading || !isHomeowner ? <LoadingSpinner /> : children}</>;
};
