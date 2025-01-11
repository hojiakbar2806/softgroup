"use client";

import Input from "@/components/common/input";
import { Link, useRouter } from "@/i18n/routing";
import { useLoginMutation } from "@/services/authService";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

export default function LoginPage() {
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

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
        toast.success("Login successful");
      } catch (err) {
        console.error("Failed to login:", err);
      }
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <form
        className="w-full p-8 sm:max-w-lg
       flex mt-auto gap-8 flex-col m-auto shadow rounded-lg"
      >
        <Input
          label="Username"
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
          label="Password"
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
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={isLoading}
          className={`bg-blue-500 text-white p-2 rounded ${
            isLoading ? "bg-primary/50" : ""
          }`}
        >
          {isLoading ? "Loading ..." : "Login"}
        </button>
        <Link href="/register" className="text-blue-500">
          Register
        </Link>
      </form>
    </div>
  );
}
