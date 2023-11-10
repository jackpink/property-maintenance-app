import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { api } from "~/utils/api";
import "react-day-picker/dist/style.css";
import "~/styles/globals.css";
import PageLayout from "~/components/Atoms/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <PageLayout>
        <Toaster position="top-center" richColors />

        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
