"use client";

import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PasswordInput from "@/components/ui/form/input/Password";
import { ApiError } from "@/types/error.type";
import { registerService } from "@/services/client/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { setItemLocalStorage } from "@/utils/localstorage";

const registerSchema = z.object({
  full_name: z
    .string()
    .refine((value) => value.trim().split(/\s+/).length === 2, {
      message: "Ad və soyad iki hissədən ibarət olmalıdır",
    }),
  email: z.string().email("Düzgün email daxil edin"),
  password: z.string().min(8, "Şifrə minimum 8 xana olmalıdı"),
  password_confirm: z.string().min(8, "Şifrə minimum 8 xana olmalıdı"),
}).refine((data) => data.password === data.password_confirm, {
  message: "Şifrələr uyğun deyil",
  path: ["password_confirm"], // Hata mesajını password_confirm alanına bağlar
});


// Form Type
type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterFormInner = () => {
  const router = useRouter();
  const params = useSearchParams()

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await registerService({
        email: data.email,
        first_name: data.full_name.split(" ")[0],
        last_name: data.full_name.split(" ")[1],
        password: data.password,
        password_confirm: data.password_confirm
      });
      setItemLocalStorage("email", response.data.email);
      const nextUrl = params.get("next")? `/otp?next=${params.get("next")}` :  "/otp";
      router.push(nextUrl)


    } catch (error) {
      const apiErrors = (error as ApiError).data;
      if (apiErrors && typeof apiErrors === "object") {
        Object.keys(apiErrors).forEach((field) => {
          const errorMessage = apiErrors[field]?.[0];
          if (errorMessage) {
            setError(field as keyof RegisterFormValues, {
              type: "manual",
              message: errorMessage,
            });
          }
        });
      } else {
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="mb-4 text-red-500 text-sm">{errors.root.message}</div>
      )}
      {/* Email */}
      <div>
        <label className="block text-[12px] font-medium leading-[16px]">Ad, soyad</label>
        <input
          type="text"
          {...register("full_name")}
          placeholder="Ad və soyad daxil edin"
          className="w-full mt-[8px] h-[52px] text-[14px] border border-[#64717C] leading-[20px] p-[16px] rounded-[8px] focus:border-primary-focus focus:ring-primary-focus"
        />
        {errors.full_name && (
          <div className="mb-4 text-red-500 text-sm">{errors.full_name.message}</div>
        )}
      </div>
      {/* Email */}
      <div className="mt-[24px]">
        <label className="block text-[12px] font-medium leading-[16px]">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="Email adresinizi girin"
          className="w-full mt-[8px] h-[52px] text-[14px] border border-[#64717C] leading-[20px] p-[16px] rounded-[8px] focus:border-primary-focus focus:ring-primary-focus"
        />
        {errors.email && (
          <div className="mb-4 text-red-500 text-sm">{errors.email.message}</div>
        )}
      </div>

      {/* Password */}
      <div className="mt-[24px]">
        <PasswordInput
          label="Şifrə"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      {/* Password */}
      <div className="mt-[24px]">
        <PasswordInput
          label="Şifrə"
          error={errors.password_confirm?.message}
          {...register("password_confirm")}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`mt-[48px] w-full h-[58px] rounded-[12px] ${isLoading
          ? "bg-primary-hover cursor-not-allowed"
          : "bg-primary hover:bg-primary-hover"
          } focus:bg-primary-focus text-white text-[20px] font-medium leading-[32px] flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291l-1.707 1.707A8.003 8.003 0 004 12H2c0 2.21.895 4.21 2.343 5.657L6 17.291z"
            ></path>
          </svg>
        ) :
          <span className="text-[16px] lg:text-[20px]">
            Qeydiyyatdan keç
          </span>
        }
      </button>
    </form>
  );
};


const RegisterForm = () => (
  <Suspense fallback={null}>
      <RegisterFormInner />
  </Suspense>
);

export default RegisterForm;