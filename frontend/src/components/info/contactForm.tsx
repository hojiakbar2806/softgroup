"use client";

import { useContactForm } from "@/store/formStore";
import { FC } from "react";
import Form from "next/form";
import Input from "../common/input";
import { X } from "lucide-react";
import { useContactUsMutation } from "@/services/userService";
import { toast } from "sonner";
import { getDictionary } from "@/features/localization/getDictionary";

type ContactFormProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

const ContactForm: FC<ContactFormProps> = ({ dictionary }) => {
  const { openContact, toggleOpenContact } = useContactForm();
  const [postContact] = useContactUsMutation();
  const dict = dictionary.InfoPage.ContactForm;

  interface ContactResponse {
    message: string;
  }

  interface ValidationError {
    detail: Array<{ msg: string }>;
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const name = formData.get("name");
      const email = formData.get("email");

      if (
        !name ||
        !email ||
        typeof name !== "string" ||
        typeof email !== "string"
      ) {
        toast.error("Hamma maydonlarni to'ldiring");
        return;
      }

      const res = await postContact({
        name: name.trim(),
        email: email.trim(),
      });

      if ("error" in res && res.error) {
        if ("data" in res.error && res.error.data) {
          const errorData = res.error.data as ValidationError;
          toast.error(errorData.detail[0]?.msg || "Validation error occurred");
        } else {
          toast.error("An error occurred while submitting the form");
        }
      } else {
        const successData = res.data as ContactResponse;
        toast.success(successData.message);
        toggleOpenContact();
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred");
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
        <h1 className="font-bold text-2xl text-center">{dict.title}</h1>
        <Input name="name" label={dict.name} type="text" />
        <Input name="email" label={dict.email} type="email" />
        <p className="text-xs text-gray-500">{dict.message}</p>
        <button
          type="submit"
          className="h-12 text-lg bg-purple-600 border border-purple-800 rounded-full duration-300 transition-all hover:bg-purple-500 hover:border-white "
        >
          {dict.submit}
        </button>

        <button
          type="button"
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
