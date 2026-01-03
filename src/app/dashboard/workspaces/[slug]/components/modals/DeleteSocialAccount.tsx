import { SocialAccount } from "@/types/social_account.type";
import React from "react";
import { HiExclamation, HiRefresh, HiTrash } from "react-icons/hi";

interface DeleteSocialAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  account: SocialAccount | null;
  isDeleting: boolean;
}

const DeleteSocialAccount: React.FC<DeleteSocialAccountProps> = ({
  isOpen,
  onClose,
  onConfirm,
  account,
  isDeleting,
}) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <HiExclamation className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Hesabı Sil
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          {account.instagram_account?.username || account.platform} hesabını silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            Ləğv et
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <HiRefresh className="w-4 h-4 animate-spin" />
                Silinir...
              </>
            ) : (
              <>
                <HiTrash className="w-4 h-4" />
                Sil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSocialAccount; 