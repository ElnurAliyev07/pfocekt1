// src/utils/toastUtils.ts
import { toast } from 'react-toastify';

// Toast tipi için enum tanımlaması
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warn',
  DEFAULT = 'default',
}

// ShowToast fonksiyonu
export const showToast = (message: string, type: ToastType = ToastType.DEFAULT): void => {
  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message);
      break;
    case ToastType.ERROR:
      toast.error(message);
      break;
    case ToastType.INFO:
      toast.info(message);
      break;
    case ToastType.WARNING:
      toast.warn(message);
      break;
    default:
      toast(message);
      break;
  }
};
