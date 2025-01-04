import LanguageDropdown from "@/components/common/langDropDown";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="flex justify-center py-5 mt-auto border-t">
      <div className="container flex items-center justify-between">
        <p className="text-[8px] flex-1 sm:px-4 sm:text-sm lg:text-base 2xl:text-lg">
          Copyright © 2008 - 2024 TemplateMo - About - Privacy Policy - Contact
          - XML Sitemap
        </p>
        <LanguageDropdown />
      </div>
    </footer>
  );
};

export default Footer;
