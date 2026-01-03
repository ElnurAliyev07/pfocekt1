"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PasswordInput from "@/components/ui/form/input/Password";
import { ApiError } from "@/types/error.type";
import Loading from "@/components/ui/icons/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { loginService } from "@/services/client/auth.service";
import { useAuth } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Düzgün email daxil edin"),
  password: z.string().min(8, "Şifrə minimum 8 xana olmalı"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  return (
    <Suspense fallback={<div>Yüklənir...</div>}>
      <LoginFormInner />
    </Suspense>
  );
};

const LoginFormInner = () => {
  const [isLoading, setIsLoading] = useState(false);

  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { setUser, setTokens } = useAuth();
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      
      const response = await loginAction(data)

      if (!response.success) {
        setError("root", {
          type: "manual",
          message: "Belə bir hesab tapılmadı",
        });
        return;
      }
      const nextUrl = params.get("next") || "/dashboard";
      router.push(nextUrl);
      setUser(response.user);
      setTokens(response.access, response.refresh);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setError("root", {
          type: "manual",
          message: "Belə hesab tapılmadı",
        });
      } else {
        setError("root", {
          type: "manual",
          message: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {errors.root && (
        <div 
          className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errors.root.message}</span>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="Email adresinizi girin"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className={`w-full h-[48px] px-4 text-base border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 outline-none`}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-500 font-medium flex items-center gap-2" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.email.message}</span>
          </p>
        )}
      </div>

      <div className="mb-6">
        <PasswordInput
          label="Şifrə"
          placeholder="Şifrənizi daxil edin"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            {...register("rememberMe")}
            className="w-5 h-5 border border-gray-300 rounded text-primary focus:ring-1 focus:ring-primary/50 cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-gray-600 font-medium cursor-pointer"
          >
            Yadda saxla
          </label>
        </div>

        <a
          href="/reset-password"
          className="text-sm text-primary font-medium hover:text-primary-hover transition-colors hover:underline focus:outline-none focus:underline"
        >
          Şifrəmi unutmuşam
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full h-[50px] rounded-lg text-white font-medium text-base transition-all duration-300 ${
          isLoading
            ? "bg-primary/70 cursor-not-allowed"
            : "bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <Loading />
            <span>Yüklənir...</span>
          </div>
        ) : (
          <span>Daxil ol</span>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
