import LanguageDropdown from "@/components/common/langDropDown";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="mt-auto border-t flex justify-between items-center shadow-sm py-5 sticky top-0 z-50">
      <p className="text-sm">© 2024 SoftGroup</p>
      <LanguageDropdown />
    </footer>
  );
};

export default Footer;
