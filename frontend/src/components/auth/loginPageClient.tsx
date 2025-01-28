"use client";

import Input from "@/components/common/input";
import { useLoginMutation } from "@/services/authService";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/features/localization/getDictionary";


type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export default function LoginPageClient({ dictionary: dict }: Props) {
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string().required(
      dict.Auth.LoginPage.reuiredUsername || "Username is required"
    ),
    password: Yup.string().required(
      dict.Auth.LoginPage.reuiredPassword || "Password is required"
    ),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        dispatch(setCredentials({ token: result.access_token }));
        router.push("/");
        toast.success(dict.Auth.LoginPage.success || "Login successful");
      } catch (err) {
        console.error("Failed to login:", err);
        toast.error((error as any)?.data?.detail || "Login failed");
      }
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <form
        className="w-full p-8 sm:max-w-lg flex mt-auto gap-8 flex-col m-auto shadow rounded-lg"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl font-bold">{dict.Auth.LoginPage.login}</h1>
        <Input
          label={dict.Auth.LoginPage.username}
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          error={formik.touched.username && !!formik.errors.username}
          helperText={
            formik.touched.username && formik.errors.username
              ? formik.errors.username
              : undefined
          }
        />
        <Input
          label={dict.Auth.LoginPage.password}
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && !!formik.errors.password}
          helperText={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : undefined
          }
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 text-white p-2 rounded ${
            isLoading ? "bg-primary/50" : ""
          }`}
        >
          {isLoading
            ? `${dict.Auth.LoginPage.login}...`
            : dict.Auth.LoginPage.login}
        </button>
        <Link href="/register" className="text-blue-500">
          {dict.Auth.RegisterPage.register}
        </Link>
      </form>
    </div>
  );
}
