import { type NextComponentType } from 'next'
import { type PropsWithChildren } from 'react';
import Head from "next/head";



const PageLayout = ({ children }: PropsWithChildren) => {
    return(
        <>
            <Head>
                <title>Prop Doc</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ccfbf1] to-[#f0fdfa]">
                {children}
            </main>
        </>
    );
}

export default PageLayout;