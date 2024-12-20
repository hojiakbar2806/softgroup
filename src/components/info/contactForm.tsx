"use client";

import { useContactForm } from "@/store/formStore";
import React from "react";
import Form from "next/form";
import Input from "../common/input";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { toast } from "sonner";

const ContactForm: React.FC = () => {
  const { openContact, toggleOpenContact } = useContactForm();
  const t = useTranslations("InfoPage.ContactForm");

  const telegramToken = "7385022476:AAEuDbLPJBCrHCQzuXDwQ-MzCb17ECk9-xE";
  const chatId = "-1002428200529";

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const res = await axios.post(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          chat_id: chatId,
          text: `📝 *Yangi Xabar* 📝\n\n👤 *Ism:* ${name}\n📧 *Email:* ${email}`,
          parse_mode: "Markdown",
        }
      );

      if (res.status === 200) {
        toast.success("Xabar muvaffaqiyatli yuborildi!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring."
      );
    }
  };

  return (
    <div
      data-open={openContact}
      className="group fixed top-0 p-4 left-0 w-full h-full flex items-center justify-center bg-black/80 z-10 transition-all duration-300 cursor-pointer pointer-events-none
      data-[open=false]:opacity-0"
    >
      <Form
        action={handleSubmit}
        className="relative z-20 flex flex-col gap-5 p-10 pointer-events-auto bg-nightSkyRadial shadow shadow-white rounded-xl text-white w-full max-w-[500px]
        scale-0 transition-all duration-300 group-data-[open=true]:scale-100"
      >
        <h1 className="font-bold text-2xl text-center">{t("title")}</h1>
        <Input name="name" label={t("name")} type="text" />
        <Input name="email" label={t("email")} type="email" />
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
      </Form>
    </div>
  );
};

export default ContactForm;
