"use client";

import { Link } from "@/i18n/routing";
import { BASE_URL } from "@/utils/const";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const PreviewPage = () => {
  const pathname = usePathname();
  const slug = pathname.split("/")[3];

  return (
    <Fragment>
      <header className="flex justify-center bg-[#3a4352] shadow-sm py-3 sticky top-0 z-50">
        <div className="container flex justify-between items-center">
          <Link href="/">
            <Image
              src="/icons/logo.svg"
              width={176}
              height={55}
              alt="logo"
              className="w-24 sm:w-28 lg:w-32 xl:w-36 2xl:w-40"
            />
          </Link>
          <Link
            href={`${BASE_URL}/templates/download/${slug}`}
            className="text-xs whitespace-nowrap px-3 py-1.5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:brightness-105 font-medium rounded-lg transition
            sm:px-4 sm:text-sm lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg"
          >
            Downoad
          </Link>
        </div>
      </header>

      <iframe
        id="secure-iframe"
        src={`${BASE_URL}/templates/${slug}/index.html`}
        className="w-full h-screen"
        sandbox="allow-scripts"
      ></iframe>
    </Fragment>
  );
};

export default PreviewPage;
