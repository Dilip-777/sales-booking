import Header from "@/components/Layout/Header";
import SideNavbar from "@/components/Layout/SideBar";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      <SessionProvider session={session}>
        {router.pathname !== "/signin" && router.pathname !== "/signup" ? (
          <>
            <SideNavbar />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden ">
              <Header />

              <main className=" p-4 md:p-6 ">
                <div className="mx-auto max-w-screen-2xl rounded-lg bg-white z-1 border p-2">
                  <Component {...pageProps} />
                </div>
              </main>
            </div>
          </>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </div>
  );
}
