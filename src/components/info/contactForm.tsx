"use client";

import { useContactForm } from "@/store/formStore";
import React from "react";
import Input from "../common/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const ContactForm: React.FC = () => {
  const { openContact, toggleOpenContact } = useContactForm();
  const t = useTranslations("InfoPage.ContactForm");

  return (
    <div
      data-open={openContact}
      className="group fixed top-0 p-4 left-0 w-full h-full flex items-center justify-center bg-black/80 z-10 transition-all duration-300 cursor-pointer pointer-events-none
      data-[open=false]:opacity-0"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative z-20 flex flex-col gap-5 p-10 pointer-events-auto bg-nightSkyRadial shadow shadow-white rounded-xl text-white w-full max-w-[500px]
        scale-0 transition-all duration-300 group-data-[open=true]:scale-100"
      >
        <h1 className="font-bold text-2xl text-center">{t("title")}</h1>
        <Input label={t("name")} type="text" />
        <Input label={t("email")} type="email" />
        <p className="text-xs text-gray-500">{t("message")}</p>
        <button className="h-14 text-lg bg-purple-800 border border-purple-800 rounded-full duration-300 transition-all hover:bg-purple-500 hover:border-white ">
          {t("submit")}
        </button>

        <button
          type="submit"
          className="text-red-600 absolute right-5 top-5"
          onClick={toggleOpenContact}
        >
          <X />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
