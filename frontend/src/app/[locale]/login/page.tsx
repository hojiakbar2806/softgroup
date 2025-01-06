"use client";

import Input from "@/components/common/input";
import { Link } from "@/i18n/routing";
import { LoginService } from "@/services/auth.service";
import { IUserLogin } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import Form from "next/form";

export default function LoginPage() {
  const mutation = useMutation({
    mutationFn: (data: IUserLogin) => LoginService(data),
  });

  const loginAction = (formData: FormData) => {
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    mutation.mutate(data);
  };
  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <Form
        action={loginAction}
        className="w-full p-8 sm:max-w-lg
       flex mt-auto gap-8 flex-col m-auto shadow rounded-lg"
      >
        <Input label="Username" name="username" />
        <Input label="Password" type="password" name="password" />
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`bg-blue-500 text-white p-2 rounded ${
            mutation.isPending ? "bg-primary/50" : ""
          }`}
        >
          {mutation.isPending ? "Loading ..." : "Login"}
        </button>
        <Link href="/register" className="text-blue-500">
          Register
        </Link>
      </Form>
    </div>
  );
}
