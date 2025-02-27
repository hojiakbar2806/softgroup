"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/input";
import { useRegisterMutation } from "@/services/authService";
import { toast } from "sonner";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  dictionary: Record<string, any>;
};

export default function RegisterPageClient({ dictionary: dict }: Props) {
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const validationSchema = Yup.object({
    full_name: Yup.string().required(dict.Auth.RegisterPage.requiredFullname),
    email: Yup.string()
      .email(dict.Auth.RegisterPage.invalidEmail)
      .required(dict.Auth.RegisterPage.requiredEmail),
    username: Yup.string().required(dict.Auth.RegisterPage.requiredUsername),
    phone_number: Yup.string()
      .required(dict.Auth.RegisterPage.requiredPhone)
      .matches(/^\+998/, dict.Auth.RegisterPage.invalidPhoneFormat)
      .min(13, dict.Auth.RegisterPage.invalidPhoneLength)
      .max(13, dict.Auth.RegisterPage.invalidPhoneLength),
    password: Yup.string()
      .min(6, dict.Auth.RegisterPage.invalidPassword)
      .required(dict.Auth.RegisterPage.requiredPassword),
  });

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      username: "",
      phone_number: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await register(values).unwrap();
        dispatch(setCredentials({ token: result.access_token }));
        router.push("/");
        toast.success(dict.Auth.RegisterPage.success);
      } catch (err: any) {
        if (err.data?.detail) {
          if (Array.isArray(err.data.detail)) {
            err.data.detail.forEach((error: any) => {
              const fieldName = error.loc[1];
              const errorMessage = error.msg;
              formik.setFieldError(fieldName, errorMessage);
            });
          } else {
            toast.error(err.data.detail);
          }
        } else {
          toast.error(dict.Auth.RegisterPage.generalError);
        }
      }
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("998")) {
      value = "998" + value;
    }
    if (value.length > 0) {
      value = "+" + value;
    }
    formik.setFieldValue("phone_number", value);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full p-8 sm:max-w-lg flex mt-auto gap-8 flex-col m-auto shadow rounded-lg"
      >
        <h1 className="text-2xl font-bold">
          {dict.Auth.RegisterPage.register}
        </h1>

        <Input
          label={dict.Auth.RegisterPage.fullname}
          type="text"
          name="full_name"
          value={formik.values.full_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.full_name && Boolean(formik.errors.full_name)}
          helperText={formik.touched.full_name && formik.errors.full_name}
        />
        <Input
          label={dict.Auth.RegisterPage.username}
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <Input
          label={dict.Auth.RegisterPage.email}
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Input
          label={dict.Auth.RegisterPage.phone}
          type="tel"
          name="phone_number"
          value={formik.values.phone_number}
          onChange={handlePhoneChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
        />
        <Input
          label={dict.Auth.RegisterPage.password}
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 text-white p-2 rounded transition-opacity ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {isLoading
            ? dict.Auth.RegisterPage.loading
            : dict.Auth.RegisterPage.register}
        </button>

        <Link href="/login" className="text-blue-500 hover:text-blue-600">
          {dict.Auth.LoginPage.login}
        </Link>
      </form>
    </div>
  );
}
