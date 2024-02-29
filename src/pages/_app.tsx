import Header from "@/components/Header";
import SideNavbar from "@/components/SideBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-screen overflow-hidden ">
      <SideNavbar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header />

        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10  ">
            <Component {...pageProps} />
          </div>
        </main>
      </div>
    </div>
    // <div className="flex h-screen">
    //   <SideNavbar />
    //   <Header />
    //   <Component {...pageProps} />
    // </div>
  );
}
