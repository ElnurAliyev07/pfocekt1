import CustomCheckbox from '@/components/ui/form/input/CustomCheckbox';
import { KeyLabel } from '@/types/keyLabel.type';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { HiX, HiLink, HiCheck } from 'react-icons/hi';
import { Modal, useDisclosure } from '@/components/ui/modal';
import Image from 'next/image';
import { useAppContext } from '@/providers/AppProvider';

interface SelectedPlatform {
  platform: KeyLabel;
  value: string;
  isValid: boolean;
}

interface SelectPlatformProps {
  onChange: (selectedPlatforms: SelectedPlatform[]) => void;
  defaultSelectedPlatforms?: SelectedPlatform[];
  className?: string;
  error?: string;
}

const platformIcons: Record<string, string> = {
  instagram: '/icons/instagram.svg',
  facebook: '/icons/facebook.svg',
  tiktok: '/icons/tiktok.svg',
  youtube: '/icons/youtube.svg',
};

const platformPlaceholders: Record<string, string> = {
  instagram: 'https://www.instagram.com/username',
  facebook: 'https://www.facebook.com/username',
  tiktok: 'https://www.tiktok.com/@username',
  youtube: 'https://www.youtube.com/@username',
};

const SelectPlatform: React.FC<SelectPlatformProps> = ({
  onChange,
  defaultSelectedPlatforms = [],
  className,
  error,
}) => {
  const { platforms } = useAppContext();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SelectedPlatform[]>(
    defaultSelectedPlatforms
  );
  const [currentPlatform, setCurrentPlatform] = useState<KeyLabel | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validatePlatformUrl = useCallback((platformKey: string, url: string) => {
    const urlPatterns = {
      instagram: ['https://www.instagram.com/'],
      facebook: ['https://www.facebook.com/'],
      tiktok: ['https://www.tiktok.com/'],
      youtube: ['https://www.youtube.com/', 'https://youtu.be/'],
    };

    const patterns = urlPatterns[platformKey as keyof typeof urlPatterns] || [];
    return patterns.some(pattern => url.startsWith(pattern));
  }, []);

  const handlePlatformClick = useCallback((platform: KeyLabel) => {
    const exists = selectedPlatforms.find((sp) => sp.platform.key === platform.key);
    if (exists) {
      if (!exists.isValid) {
        setSelectedPlatforms((prev) => prev.filter((sp) => sp.platform.key !== platform.key));
        return;
      }
      setCurrentPlatform(platform);
      onOpen();
    } else {
      setSelectedPlatforms((prev) => [...prev, { platform, value: '', isValid: false }]);
      setCurrentPlatform(platform);
      onOpen();
    }
  }, [selectedPlatforms, onOpen]);

  const updatePlatformValue = useCallback((platformKey: string, value: string) => {
    const isValid = validatePlatformUrl(platformKey, value);
    setSelectedPlatforms((prev) =>
      prev.map((sp) =>
        sp.platform.key === platformKey ? { ...sp, value, isValid } : sp
      )
    );

    if (!isValid && !value) {
      setSelectedPlatforms((prev) => prev.filter((sp) => sp.platform.key !== platformKey));
      onClose();
    }
  }, [validatePlatformUrl, onClose]);

  const removePlatform = useCallback((platformKey: string) => {
    setSelectedPlatforms((prev) => prev.filter((sp) => sp.platform.key !== platformKey));
    onClose();
  }, [onClose]);

  useEffect(() => {
    onChange(selectedPlatforms);
  }, [selectedPlatforms, onChange]);

  const currentPlatformData = currentPlatform 
    ? selectedPlatforms.find((sp) => sp.platform.key === currentPlatform.key)
    : null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const selectedPlatform = selectedPlatforms.find(
            (sp) => sp.platform.key === platform.key
          );
          const isSelected = !!selectedPlatform;
          const hasValidUrl = selectedPlatform?.isValid;

          return (
            <button
              key={platform.key}
              type="button"
              onClick={() => handlePlatformClick(platform)}
              className={cn(
                "w-full aspect-square rounded-xl p-4 flex flex-col items-center justify-center gap-2",
                "transition-all duration-200 border-2",
                isSelected 
                  ? hasValidUrl
                    ? "border-green-500 bg-green-50"
                    : "border-primary bg-primary/5" 
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              )}
            >
              <div className="relative">
                <Image
                  width={32}
                  height={32}
                  src={platformIcons[platform.key] || '/icons/default-platform.svg'}
                  alt={platform.label}
                  className={cn(
                    "w-8 h-8 object-contain",
                    isSelected && !hasValidUrl && "opacity-50"
                  )}
                />
                {hasValidUrl && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                    <HiCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {platform.label}
              </span>
              {isSelected && !hasValidUrl && (
                <span className="text-xs text-primary">Link əlavə edin</span>
              )}
            </button>
          );
        })}
      </div>

      <Modal 
        hideCloseButton
        isOpen={isOpen} 
        onOpenChange={onClose}
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiLink className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-gray-900">
                {currentPlatform?.label} linki
              </h4>
            </div>
            
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                className={cn(
                  "w-full h-10 px-3 border rounded-lg transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  currentPlatformData?.isValid
                    ? "border-green-500 focus:border-green-500"
                    : "border-red-500 focus:border-red-500"
                )}
                placeholder={currentPlatform ? platformPlaceholders[currentPlatform.key] : ''}
                value={currentPlatformData?.value || ''}
                onChange={(e) => updatePlatformValue(currentPlatform?.key || '', e.target.value)}
                autoFocus
              />
              {!currentPlatformData?.isValid && currentPlatformData?.value && (
                <p className="text-red-500 text-sm">
                  Zəhmət olmasa düzgün {currentPlatform?.label} linki daxil edin
                </p>
              )}
              <p className="text-xs text-gray-500">
                Nümunə: {currentPlatform ? platformPlaceholders[currentPlatform.key] : ''}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  removePlatform(currentPlatform?.key || '');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!currentPlatformData?.isValid) {
                    removePlatform(currentPlatform?.key || '');
                  }
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-darker rounded-lg"
              >
                Təsdiqlə
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default SelectPlatform;
