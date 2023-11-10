import { type PropsWithChildren } from "react";
import Head from "next/head";
import Nav from "../Molecules/Nav";
import Footer from "../Molecules/Footer";
import clsx from "clsx";

//import { GeistMono } from "geist";

const PageLayout = ({ children }: PropsWithChildren) => {
  //console.log(GeistSans.className);
  return (
    <>
      <Head>
        <title>Prop Doc</title>
        <meta name="Prop Doc App" content="Property Maintenance App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={clsx("flex min-h-screen flex-col items-center bg-light")}
      >
        <Nav />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default PageLayout;
