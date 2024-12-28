"use client";

import { useMutation } from "@tanstack/react-query";
import Form from "next/form";
import React from "react";
import Input from "@/components/common/input";
import { RegisterService } from "@/services/auth.service";
import { IUserRegister } from "@/types/user";
import { Link } from "@/i18n/routing";

export default function RegisterPage() {
  const mutation = useMutation({
    mutationFn: (data: IUserRegister) => RegisterService(data),
  });

  const onSubmit = (formData: FormData) => {
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      phone_number: formData.get("phone_number") as string,
    };

    mutation.mutate(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Form
        action={onSubmit}
        className="w-full p-8 sm:max-w-lg
       flex mt-auto gap-8 flex-col m-auto shadow rounded-lg"
      >
        <h2 className="text-2xl font-bold">Register</h2>

        <Input label="Fullname" type="text" name="full_name" />
        <Input label="Username" type="text" name="username" />
        <Input label="Email" type="email" name="email" />
        <Input label="Phone number" type="text" name="phone_number" />
        <Input label="Password" type="password" name="password" />

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${
            mutation.isPending ? "bg-primary/50" : ""
          }`}
        >
          {mutation.isPending ? "Loading ..." : "Register"}
        </button>

        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </Form>
    </div>
  );
}
