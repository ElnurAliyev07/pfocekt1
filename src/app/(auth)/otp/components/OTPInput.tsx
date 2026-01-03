"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { otpVerifyService } from "@/services/client/auth.service";
import { getItemLocalStorage, removeItemLocalStorage } from "@/utils/localstorage";

interface Props {
  isDisabled: boolean;
}

const OTPInput: React.FC<Props> = ({ isDisabled = false }) => {
  return (
    <Suspense fallback={<p className="text-primary text-sm mt-2">Yükleniyor...</p>}>
      <OTPInputContent isDisabled={isDisabled} />
    </Suspense>
  );
};

const OTPInputContent: React.FC<Props> = ({ isDisabled }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = async (value: string, index: number) => {
    setError(null);

    if (!/^\d*$/.test(value)) return; // Sadece rakamlar kabul edilir

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      await submitOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.every((char) => /^\d$/.test(char))) {
      const filledOtp = pasteData.concat(Array(6 - pasteData.length).fill(""));
      setOtp(filledOtp);
      inputsRef.current[pasteData.length]?.focus();

      if (filledOtp.every((digit) => digit !== "")) {
        submitOTP(filledOtp.join(""));
      }
    }
  };

  const submitOTP = async (otpValue: string) => {
    setError(null);
    setLoading(true);
    const nextUrl = params.get("next") ? `/otp/confirmed?next=${params.get("next")}` : "/otp/confirmed";

    try {
      await otpVerifyService({
        email: getItemLocalStorage<string>("email") || "",
        otp: otpValue,
      });
      removeItemLocalStorage("email");
      router.push(nextUrl);
    } catch (err) {
      console.log(err);
      setError("OTP dəyərini doğru daxil edin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-4">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={`w-[60px] h-[55px] border ${error ? "border-red-500" : "border-none"
              } rounded-md text-center bg-[#F9F9F9] text-lg focus:outline-hidden focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-primary"
              }`}
            disabled={loading || isDisabled}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {loading && <p className="text-primary text-sm mt-2">Doğrulanıyor...</p>}
    </div>
  );
};

export default OTPInput;
