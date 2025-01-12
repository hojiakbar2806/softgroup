"use client";

import { Link } from "@/i18n/routing";
import { BASE_URL } from "@/lib/const";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { DownloadTemplateService } from "@/services/template.service";

const PreviewPage = () => {
  const pathname = usePathname();
  const slug = pathname.split("/")[3];

  const download = useMutation({
    mutationFn: () => DownloadTemplateService(slug),
  });

  return (
    <Fragment>
      <header className="flex justify-center bg-[#3a4352] shadow-sm py-3 sticky top-0 z-50">
        <div className="container flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl text-white">Softgroup</h1>
          </Link>
          <button
            className="text-xs sm:px-4 sm:text-sm lg:px-5 lg:text-base 2xl:px-6 2xl:text-lg
            whitespace-nowrap px-3 py-1.5 text-white  font-medium rounded-lg transition 
            bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:brightness-105"
            onClick={() => download.mutate()}
          >
            Downoads
          </button>
        </div>
      </header>

      <iframe
        id="secure-iframe"
        src={`${BASE_URL}/templates/${slug}/index.html`}
        className="w-full flex-1"
        sandbox="allow-scripts"
      ></iframe>
    </Fragment>
  );
};

export default PreviewPage;
