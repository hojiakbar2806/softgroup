"use client";

import { BASE_URL } from "@/utils/const";
import { usePathname } from "next/navigation";

const PreviewPage = () => {
  const pathname = usePathname();
  const slug = pathname.split("/")[3];

  return (
    <>
      <iframe
        id="secure-iframe"
        src={`${BASE_URL}/docs/templates/${slug}/index.html`}
        className="w-full h-screen"
        sandbox="allow-scripts"
      ></iframe>
    </>
  );
};

export default PreviewPage;
