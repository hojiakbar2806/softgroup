"use client";

import { useContactForm } from "@/store/formStore";
import React from "react";
import Input from "../common/input";
import { X } from "lucide-react";

const ContactForm: React.FC = () => {
  const { openContact, toggleOpenContact } = useContactForm();

  return (
    <div
      data-open={openContact}
      className="group fixed top-0 p-4 left-0 w-full h-full flex items-center justify-center bg-black/80 z-10 transition-all duration-300 cursor-pointer pointer-events-none
      data-[open=false]:opacity-0
      data-[open=true]:pointer-events-auto"
    >
      <form
        className="relative z-20 flex flex-col gap-5 p-10 pointer-events-auto bg-nightSkyRadial shadow shadow-white rounded-xl text-white w-full max-w-[500px]
        scale-0 transition-all duration-300 group-data-[open=true]:scale-100"
      >
        <h1 className="font-bold text-2xl text-center">Biz bilan bog'lanish</h1>
        <Input
          label="Ismingiz"
          type="text"
          className="rounded-none border-b"
          labelClass="text-white"
        />
        <Input
          label="Elektron pochta"
          type="text"
          className="rounded-none border-b"
          labelClass="text-white"
        />
        <p className="text-white text-xs">
          Siz qo'ldirgan ma'lumot bilan biz sizga bo'g'lanamiz
        </p>
        <button className="px-4 py-3 bg-purple-500 rounded-full">
          Jo'natish
        </button>

        <button
          type="button"
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
