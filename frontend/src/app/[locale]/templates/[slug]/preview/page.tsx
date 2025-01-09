"use client";

import { Link } from "@/i18n/routing";
import { MyProfileService } from "@/services/user.service";
import { IUser } from "@/types/user";
import { BASE_URL } from "@/lib/const";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const PreviewPage = () => {
  const pathname = usePathname();
  const slug = pathname.split("/")[3];

  const isLoggedIn = document.cookie.includes("isLoggedIn");

  const { data: user } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: MyProfileService,
    enabled: !!isLoggedIn,
  });

  return (
    <Fragment>
      <header className="flex justify-center bg-[#3a4352] shadow-sm py-3 sticky top-0 z-50">
        <div className="container flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl text-white">Softgroup</h1>
          </Link>
          <Link
            data-disabled={
              user?.is_verified !== true && slug.split(".").length > 1
            }
            href={`${BASE_URL}/templates/download/${slug}`}
            className="text-xs whitespace-nowrap px-3 py-1.5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:brightness-105 font-medium rounded-lg transition
            sm:px-4 sm:text-sm lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg
            data-[disabled=true]:pointer-events-none
            data-[disabled=true]:opacity-50
            data-[disabled=true]:cursor-not-allowed"
          >
            Downoads
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
