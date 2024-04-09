import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <div className="min-h-screen bg-slate-100">
        <div className="container relative pt-12">
          <div className=" rounded-[0.5rem] border bg-background shadow-md md:shadow-xl ">
            <main className={`font-sans ${inter.variable} `}>
              <Toaster />
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
