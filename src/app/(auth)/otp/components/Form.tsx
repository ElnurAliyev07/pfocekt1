'use client'

import React, { useEffect, useState } from 'react';
import OTPInput from './OTPInput';

const Form: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(1800); // Başlangıç geri sayım süresi
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Temizleme
    }
    setIsDisabled(true)
  }, [timeLeft]);

  const resendCode = () => {
    setIsDisabled(false);
    setTimeLeft(1800); // Sayaç sıfırlanıyor
  };

  // Geri sayımın "mm:ss" formatında görüntülenmesi
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  return (
    <>
      <OTPInput isDisabled={isDisabled} />
      <div className={`mt-[28px] text-center leading-[24px] font-medium ${timeLeft > 10 ? 'text-primary' : 'text-red-500'}`}>
        {timeLeft > 0 ? formatTime(timeLeft) : 'Kodun müddəti bitib'}
      </div>
      <p className="mt-[36px] text-center">
        Kodu almadınız?{' '}
        <button
          className="text-primary"
          onClick={resendCode}
        >
          Yenidən göndər
        </button>
      </p>
    </>
  );
};

export default Form;
