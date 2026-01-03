'use client';

import React, { useState, useCallback } from 'react';
import Modal from '@/components/ui/modal/Modal';
import Image from 'next/image';
import VideoPlayer from '@/components/common/video-player/VideoPlayer';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'pdf' | 'document' | 'spreadsheet' | 'presentation' | 'other';
  alt?: string;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  alt = 'Media preview'
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
    

  const renderMediaContent = () => {
    switch (mediaType) {
      case 'image':
        return !imageError ? (
          <Image
            src={mediaUrl}
            alt={alt}
            width={700}
            height={300}
            className="object-contain max-h-[90vh]"
            priority
            onError={handleImageError}
            unoptimized={mediaUrl.startsWith('blob:') || mediaUrl.startsWith('data:')}
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-red-500">Resim yüklenemedi</p>
            <Image
               width={1000}
               height={1000}
              src={mediaUrl} 
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        );

      case 'video':
        return (
          <VideoPlayer
            sources={[{
              id: 1,
              name: alt || 'Video',
              url: mediaUrl,
              poster: '',
              duration: '0:00',
              description: '',
              category: '',
              views: '',
              likes: '',
              qualities: {
                'auto': mediaUrl,
                '1080p': mediaUrl,
                '720p': mediaUrl,
                '480p': mediaUrl,
                '360p': mediaUrl
              }
            }]}
            className="w-full max-w-4xl"
            autoPlay={false}
            muted={true}
          />
        );

      case 'pdf':
        return (
          <iframe
            src={mediaUrl}
            className="w-full h-[90vh] rounded-lg"
            title="PDF Preview"
          />
        );

      case 'document':
      case 'spreadsheet':
      case 'presentation':
        return (
          <div className="w-full h-[90vh] flex items-center justify-center">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(mediaUrl)}`}
              className="w-full h-full rounded-lg"
              title="Document Preview"
            />
          </div>
        );

      case 'other':
      default:
        return (
          <div className="text-center p-4">
            <p className="text-gray-500">Bu dosya türü önizlenemiyor</p>
            <a 
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Dosyayı İndir
            </a>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="4xl"
      className="p-0 bg-transparent !shadow-none"
      hideCloseButton
    >
      <div className="relative w-full h-full min-h-[200px] max-h-[90vh] flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close preview"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Media container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {renderMediaContent()}
        </div>

        {/* Backdrop click area */}
        <div 
          className="absolute inset-0 -z-10 cursor-pointer"
          onClick={handleClose}
          aria-hidden="true"
        />
      </div>
    </Modal>
  );
};

export default MediaPreviewModal;

