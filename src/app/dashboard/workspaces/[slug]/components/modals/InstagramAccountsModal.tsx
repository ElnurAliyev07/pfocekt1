'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { FaInstagram, FaCheck } from "react-icons/fa";
import { postInstagramAccountService } from "@/services/client/instagram.service";
import { SocialMediaPlatform } from "@/types/social-media.type";
import Image from 'next/image';
import usePlanningStore from '@/store/planningStore';
import { showToast, ToastType } from '@/utils/toastUtils';
import { useAppContext } from '@/providers/AppProvider';

interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
  biography: string;
  business_account_id: string;
  access_token: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  accounts: InstagramAccount[];
  isLoading?: boolean;
  onSelect?: (account: InstagramAccount) => void;
  selectedAccountId?: string;
  planningId?: number;
}

const InstagramAccountsModal: React.FC<Props> = ({ 
  isOpen, 
  onOpenChange, 
  accounts, 
  isLoading = false,
  onSelect,
  selectedAccountId,
  planningId
}) => {
  const { setIsLoading } = useAppContext();
  const { fetchPlannings } = usePlanningStore();

  const handleConfirm = async () => {
    if (!selectedAccountId || !planningId) {
      console.error('Missing required data:', { selectedAccountId, planningId });
      return;
    }

    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
    if (!selectedAccount) {
      console.error('Selected account not found');
      return;
    }

    try {
      setIsLoading(true);
      const requestData = {
        platform: 'instagram' as SocialMediaPlatform,
        platform_user_id: selectedAccount.id,
        planning: planningId,
        instagram_account: {
          username: selectedAccount.username,
          display_name: selectedAccount.name,
          access_token: selectedAccount.access_token,
        //   refresh_token: '', // This might need to be handled differently
        //   token_expires_at: '', // This might need to be handled differently
          business_account_id: selectedAccount.business_account_id,
          followers_count: selectedAccount.followers_count,
          media_count: selectedAccount.media_count,
          biography: selectedAccount.biography,
          profile_picture_url: selectedAccount.profile_picture_url
        }
      };

        await postInstagramAccountService(requestData);
        await fetchPlannings();
        showToast('Hesab əlavə edildi', ToastType.SUCCESS)

      if (onSelect) {
        onSelect(selectedAccount);
      }
      onOpenChange();
    } catch (error) {
      console.error('Error adding Instagram account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="sm"
    >
      <ModalContent>
        <ModalHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FaInstagram className="text-pink-600 text-lg" />
            <span className="text-base">Instagram Hesabları</span>
          </div>
        </ModalHeader>
        <ModalBody className="py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Hesap bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => onSelect?.(account)}
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all
                    ${selectedAccountId === account.id 
                      ? 'bg-pink-50 border-pink-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  <Image
                    width={40}
                    height={40}
                    src={account.profile_picture_url}
                    alt={account.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{account.name}</h3>
                      {selectedAccountId === account.id && (
                        <FaCheck className="text-pink-600 text-xs" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="truncate">@{account.username}</span>
                      <span>•</span>
                      <span>{account.followers_count.toLocaleString()} takipçi</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter className="pt-2">
          <div className="flex gap-2 w-full">
            <Button
              onClick={onOpenChange}
              className="flex-1 !bg-gray-100 !hover:bg-gray-200 !text-gray-700 text-sm"
            >
              Bağla
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedAccountId}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Təsdiqlə
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InstagramAccountsModal; 