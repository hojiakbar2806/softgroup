"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/common/input";
import { Link, useRouter } from "@/i18n/routing";
import { useRegisterMutation } from "@/services/authService";
import { toast } from "sonner";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";

const validationSchema = Yup.object({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  username: Yup.string().required("Username is required"),
  phone_number: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function RegisterPage() {
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

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
        toast.success("Registration successful");
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full p-8 sm:max-w-lg flex mt-auto gap-8 flex-col m-auto shadow rounded-lg"
      >
        <h2 className="text-2xl font-bold">Register</h2>

        <Input
          label="Fullname"
          type="text"
          name="full_name"
          value={formik.values.full_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.full_name && Boolean(formik.errors.full_name)}
          helperText={formik.touched.full_name && formik.errors.full_name}
        />
        <Input
          label="Username"
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={
            formik.touched.username && formik.errors.username
              ? formik.errors.username
              : ""
          }
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Input
          label="Phone number"
          type="text"
          name="phone_number"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
        />
        <Input
          label="Password"
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
          className={`bg-blue-500 text-white p-2 rounded ${
            isLoading ? "bg-primary/50" : ""
          }`}
        >
          {isLoading ? "Loading ..." : "Register"}
        </button>

        {error && (
          <p className="text-red-500 text-sm">
            Registration failed. Please try again.
          </p>
        )}

        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      </form>
    </div>
  );
}
