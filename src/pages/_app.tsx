import { type AppType } from "next/app";
import { ClerkProvider } from '@clerk/nextjs'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import PageLayout from "~/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  )
  
};

export default api.withTRPC(MyApp);
